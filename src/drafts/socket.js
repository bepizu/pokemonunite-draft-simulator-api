const { getDraft, updateDraft } = require("./models")
const { MAX_COUNTDOWN_TIMER, DRAFT_STATUS, POKEMONS, PICK_ORDER } = require("../config/constants")

let draftSessions = {}
let draftSessionsCountdown = {}

function initDraftSocket({io, socket}) {
  io.emit("draft-connecting", socket.id)

  socket.on("disconnect", () => {
    let sessionId
    Object.keys(draftSessions).map(key => draftSessions[key]).forEach(({_id, connections}) => {
      if (connections) {
        Object.keys(connections).forEach(key => {
          if (connections[key] === socket.id) {
            sessionId = _id
          }
        })
      }
    })

    if (sessionId) {
      if (draftSessions[sessionId]) {
        draftSessions = Object.keys(draftSessions).filter(key => key !== sessionId)

        const draftSessionCountdown = draftSessionsCountdown[sessionId]
        if (draftSessionCountdown && draftSessionCountdown.interval) {
          clearInterval(draftSessionCountdown.interval)
        }
        draftSessionsCountdown = Object.keys(draftSessionsCountdown).filter(key => key !== sessionId)
      }
    }
  })

  socket.on("enter-draft", (payload) => enterDraft({socket, io, payload}))
  socket.on("update-status-draft", (payload) => updateDraftStatus({io, payload}))
  socket.on("select-pick", (payload) => selectPick({io, payload}))
}

async function enterDraft ({socket, io, payload: {sessionId, viewType, draftType}}) {
  socket.join([sessionId, `${sessionId}_${viewType}`])
  
  let draftSession = draftSessions[sessionId]
  
  if (!draftSession) {
    let draftData
    
    if (draftType === "professional" || draftType === "spectator") {
      draftData = await getDraft({sessionId})
    } else {
      draftData = {
        _id: sessionId,
        lobbyId: "",
        team1: {
          name: "Team 1",
          ban1: {},
          pick1: {},
          pick2: {},
          pick3: {},
          pick4: {},
          pick5: {},
        },
        team2: {
          name: "Team 2",
          ban1: {},
          pick1: {},
          pick2: {},
          pick3: {},
          pick4: {},
          pick5: {},
        },
        draftType,
        spectator: {
          active: false
        },
        pickTurn: 0
      }
    }

    draftSession = {
      ...draftData,
      pokemons: POKEMONS.filter(pkmn => pkmn.active).map(pkmn => Object.assign({}, pkmn)),
      connections: { [viewType]: socket.id }
    }
  } else {
    draftSession.connections[viewType] = socket.id
  }

  draftSessions[sessionId] = draftSession

  io
    .to(`${sessionId}_${viewType}`)
    .emit("draft-update", draftSession)
}

function updateDraftStatus({io, payload: {sessionId, draftStatus, pickTurnTeam}}) {
  !draftSessionsCountdown[sessionId] && (draftSessionsCountdown[sessionId] = {})
  const draftSessionCountdown = draftSessionsCountdown[sessionId]
  const draftSession = draftSessions[sessionId]

  switch(draftStatus) {
    case DRAFT_STATUS.NOT_STARTED:
      draftSessionCountdown.countdown = 0
      draftSessionCountdown.draftStatus = DRAFT_STATUS.NOT_STARTED
      break
      
    case DRAFT_STATUS.STARTED:
      draftSessionCountdown.countdown = MAX_COUNTDOWN_TIMER
      draftSessionCountdown.draftStatus = DRAFT_STATUS.STARTED

      if (draftSessionCountdown.interval) {
        clearInterval(draftSessionCountdown.interval)
      }

      draftSessionCountdown.interval = setInterval(() => {  
        if (draftSessionCountdown.countdown > 0) {
          draftSessionCountdown.countdown = draftSessionCountdown.countdown - 1

          io 
            .to(`${sessionId}`)
            .emit("update-draft-countdown", {
              countdown: draftSessionCountdown.countdown,
              draftStatus: DRAFT_STATUS.STARTED,
              pickTurnTeam
            })
        } else { // timedout algorithm
          clearInterval(draftSessionCountdown.interval)

          const pickTurn = PICK_ORDER[draftSession.pickTurn]
          const timedoutSelection = []

          pickTurn.picks.forEach(pick => {
            if (draftSession.pokemons) {
              const notSelectedPokemonList = draftSession.pokemons.filter(pkmn => pkmn.picked === undefined)

              let randomNumber
              do { randomNumber = Math.random() * notSelectedPokemonList.length } while (!(randomNumber < notSelectedPokemonList.length))
              
              const pokemon = notSelectedPokemonList[Math.round(randomNumber) - 1]
              const pickAlreadySelectedByTeam = draftSession[pickTurn.team][pick].name
              const selectedPokemonOnTimedout = timedoutSelection.find((pkmn) => pkmn.name === pokemon.name)

              if (!selectedPokemonOnTimedout && !pickAlreadySelectedByTeam) {
                timedoutSelection.push(pokemon)
              }    
            } else {
              console.warn("pokemon list empty")
            }
          })
          
          timedoutSelection.forEach((pkmn => {
            selectPick({io, payload: {
              draftSessionId: sessionId,
              pokemon: pkmn,
              pickTurnTeam: pickTurnTeam === "team1" ? "team2" : "team1",
              timedout: true
            }})
          }))
          

          if (pickTurn.turn < 7) { // RESET COUNTDOWN
            updateDraftStatus({
              io, payload: {
                sessionId: draftSession._id,
                draftStatus: DRAFT_STATUS.STARTED,
                pickTurnTeam: pickTurnTeam === "team1" ? "team2" : "team1"
              }
            })
          } else if (pickTurn.turn === 7) {
            draftSessionCountdown.draftStatus = DRAFT_STATUS.FINISHED
            draftSessionCountdown.countdown = 0

            updateDraftStatus({
              io, payload: {
                sessionId: draftSession._id,
                draftStatus: DRAFT_STATUS.FINISHED,
                pickTurnTeam: pickTurnTeam === "team1" ? "team2" : "team1"
              }
            })
          }

          updateDraftSession({io, draftSession})
        }
      }, 1000)
      break

    case DRAFT_STATUS.PAUSED:
      draftSessionCountdown.draftStatus = DRAFT_STATUS.PAUSED
      break;

    case DRAFT_STATUS.FINISHED:
      draftSession.draftStatus = DRAFT_STATUS.FINISHED
      clearInterval(draftSessionCountdown.interval)
      io 
        .to(`${sessionId}`)
        .emit("update-draft-countdown", {
          draftStatus: draftSessionCountdown.draftStatus,
          countdown: MAX_COUNTDOWN_TIMER,
          pickTurnTeam: pickTurnTeam === "team1" ? "team2" : "team1"
        })
      break;

    default:
      console.warn("unknown-draft-status", {sessionId, draftStatus})
  }
}

async function selectPick({io, payload: { draftSessionId, pokemon, selectedTeam, timedout }}) {
  const draftSession = draftSessions[draftSessionId]
  const { team, picks } = PICK_ORDER[draftSession.pickTurn]
  const canPickPokemon = (team === selectedTeam) || draftSession.draftType === "individual"

  if ((!timedout && (!canPickPokemon && draftSession.draftType === "professional")) || draftSession.draftType === "spectator") {
    return
  }
  
  if (draftSession && draftSession.pokemons) {
    const teamPickSelected = draftSession[team]

    for (let i = 0; i < picks.length; i++) {
      const pick = picks[i]

      if (teamPickSelected[pick].name === undefined) {
        teamPickSelected[pick] = pokemon
        currentPickTurnSelected = pick

        const selectedPokemon = draftSession.pokemons.find((pkmn) => pkmn.name === pokemon.name)
        selectedPokemon && (selectedPokemon.picked = team)
        break;
      }
    }
    
    const finishTurn = picks.every(pick => teamPickSelected[pick].name !== undefined)
    const draftSessionCountdown = draftSessionsCountdown[draftSession._id]

    if (finishTurn) {
      const nextPickTurn = draftSession.pickTurn + 1

      if (nextPickTurn < PICK_ORDER.length) {
        draftSession.pickTurn = nextPickTurn


        // why if draftStatus = started?
        if (draftSessionCountdown && draftSessionCountdown.draftStatus === DRAFT_STATUS.STARTED) {
          io 
            .to(`${draftSession._id}`)
            .emit("update-draft-countdown", {
              draftStatus: DRAFT_STATUS.STARTED,
              countdown: MAX_COUNTDOWN_TIMER,
              pickTurnTeam: selectedTeam === "team1" ? "team2" : "team1"
            })
          updateDraftStatus({
            io, payload: {
              sessionId: draftSession._id,
              draftStatus: DRAFT_STATUS.STARTED,
              pickTurnTeam: selectedTeam === "team1" ? "team2" : "team1"
            }
          })
        }
      } else {
        draftSession.draftStatus = DRAFT_STATUS.FINISHED
        draftSessionCountdown.countdown = MAX_COUNTDOWN_TIMER
        draftSessionCountdown.draftStatus = DRAFT_STATUS.FINISHED

        updateDraftStatus({
          io, payload: {
            sessionId: draftSession._id,
            draftStatus: DRAFT_STATUS.FINISHED,
            pickTurnTeam: selectedTeam === "team1" ? "team2" : "team1"
          }
        })
      }
    }

    updateDraftSession({io, draftSession})
  }

}

async function updateDraftSession({io, draftSession}) {
  let draftSessionToUpdate = {}
  Object.keys(draftSession).filter(key => key !== "_id").map(key => draftSessionToUpdate[key] = draftSession[key])

  let result = true
  
  if (draftSession.draftType === "individual") {
    result = true
  } else {
    // result = await updateDraft({sessionId: draftSession._id, payload: draftSessionToUpdate})
  }

  if (result) {
    io
      .to(`${draftSession._id}`)
      .emit("draft-update", draftSession)
  } else {
  } 
}

module.exports = {
  initDraftSocket
}