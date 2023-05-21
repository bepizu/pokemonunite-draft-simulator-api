const { getDraft, createDraft, updateDraft } = require('./models');
const {
  MAX_COUNTDOWN_TIMER,
  DRAFT_STATUS,
  POKEMONS,
  TeamEnum,
  PICK_ORDER_ALTERNATE_BAN,
  PICK_ORDER_SIMULTANEOUSLY_BAN,
} = require('../config/constants');

let draftSessions = {};
let draftSessionsCountdown = {};

function initDraftSocket({ io, socket }) {
  io.emit('draft-connecting', socket.id);

  socket.on('disconnect', () => {
    let sessionId;
    Object.keys(draftSessions)
      .map((key) => draftSessions[key])
      .forEach(({ _id, connections }) => {
        if (connections) {
          Object.keys(connections).forEach((key) => {
            if (connections[key] === socket.id) {
              sessionId = _id;
            }
          });
        }
      });

    if (sessionId) {
      if (draftSessions[sessionId]) {
        draftSessions = Object.keys(draftSessions).filter(
          (key) => key !== sessionId
        );

        const draftSessionCountdown = draftSessionsCountdown[sessionId];
        if (draftSessionCountdown && draftSessionCountdown.interval) {
          clearInterval(draftSessionCountdown.interval);
        }
        draftSessionsCountdown = Object.keys(draftSessionsCountdown).filter(
          (key) => key !== sessionId
        );
      }
    }
  });

  socket.on('enter-draft', (payload) => enterDraft({ socket, io, payload }));
  socket.on('update-status-draft', (payload) =>
    updateDraftStatus({ io, payload })
  );
  socket.on('select-pick', (payload) => selectPick({ io, payload }));
  socket.on('select-ban', (payload) => selectBans({ io, payload }));
}

async function getDraftSession({ draftSessionId }) {
  let draftSession;

  if (!draftSessionId) {
    draftSession = {
      lobbyId: '',
      team1: {
        name: 'Team 1',
        ban1: {},
        pick1: {},
        pick2: {},
        pick3: {},
        pick4: {},
        pick5: {},
      },
      team2: {
        name: 'Team 2',
        ban1: {},
        pick1: {},
        pick2: {},
        pick3: {},
        pick4: {},
        pick5: {},
      },
      draftType: 'individual',
      spectator: {
        active: false,
      },
      pickTurn: 0,
      pokemons: POKEMONS.filter((pkmn) => pkmn.active).map((pkmn) =>
        Object.assign({}, pkmn)
      ),
      connections: { team1: '', team2: '' },
    };

    const id = await createDraft({ payload: draftSession });
    draftSession._id = id;
    draftSessions[id] = draftSession;
  } else {
    draftSession = draftSessions[draftSessionId];

    if (!draftSession) {
      draftSession = await getDraft({ sessionId: draftSessionId });
    }
  }

  return draftSession;
}

async function enterDraft({ socket, io, payload: { sessionId, viewType } }) {
  socket.join([sessionId, `${sessionId}_${viewType}`]);

  const draftSession = await getDraftSession({ draftSessionId: sessionId });
  draftSession.connections[viewType] = socket.id;
  draftSessions[sessionId] = draftSession;

  io.to(`${sessionId}_${viewType}`).emit('draft-update', draftSession);
}

async function updateDraftStatus({
  io,
  payload: { sessionId, draftStatus, pickTurnTeam },
}) {
  !draftSessionsCountdown[sessionId] &&
    (draftSessionsCountdown[sessionId] = {});
  const draftSessionCountdown = draftSessionsCountdown[sessionId];
  const draftSession = await getDraftSession({ draftSessionId: sessionId });

  switch (draftStatus) {
    case DRAFT_STATUS.NOT_STARTED:
      draftSessionCountdown.countdown = 0;
      draftSessionCountdown.draftStatus = DRAFT_STATUS.NOT_STARTED;
      break;

    case DRAFT_STATUS.STARTED:
      draftSessionCountdown.countdown = MAX_COUNTDOWN_TIMER;
      draftSessionCountdown.draftStatus = DRAFT_STATUS.STARTED;

      if (draftSessionCountdown.interval) {
        clearInterval(draftSessionCountdown.interval);
      }

      draftSessionCountdown.interval = setInterval(() => {
        if (
          draftSessionCountdown.countdown > 0 &&
          draftSessionCountdown.draftStatus !== DRAFT_STATUS.FINISHED
        ) {
          draftSessionCountdown.countdown = draftSessionCountdown.countdown - 1;

          io.to(`${sessionId}`).emit('update-draft-countdown', {
            countdown: draftSessionCountdown.countdown,
            draftStatus: DRAFT_STATUS.STARTED,
            pickTurnTeam,
          });
        } else {
          // timedout algorithm
          clearInterval(draftSessionCountdown.interval);

          const pickTurn =
            draftSession.draftType !== 'individual'
              ? PICK_ORDER_SIMULTANEOUSLY_BAN[draftSession.pickTurn]
              : PICK_ORDER_ALTERNATE_BAN[draftSession.pickTurn];
          const timedoutSelection = [];

          if (
            draftSession.draftType === 'individual' ||
            draftSession.pickTurn > 0
          ) {
            pickTurn.picks.forEach((pick) => {
              if (draftSession.pokemons) {
                const notSelectedPokemonList = draftSession.pokemons.filter(
                  (pkmn) => pkmn.picked === undefined
                );

                let randomNumber;
                do {
                  randomNumber = Math.random() * notSelectedPokemonList.length;
                } while (!(randomNumber < notSelectedPokemonList.length));

                const pokemon =
                  notSelectedPokemonList[Math.round(randomNumber) - 1];
                const pickAlreadySelectedByTeam =
                  draftSession[pickTurn.team][pick].name;
                const selectedPokemonOnTimedout = timedoutSelection.find(
                  (pkmn) => pkmn.name === pokemon.name
                );

                if (!selectedPokemonOnTimedout && !pickAlreadySelectedByTeam) {
                  timedoutSelection.push(pokemon);
                }
              } else {
                console.warn('pokemon list empty');
              }
            });

            timedoutSelection.forEach((pkmn) => {
              selectPick({
                io,
                payload: {
                  draftSessionId: sessionId,
                  pokemon: pkmn,
                  pickTurnTeam:
                    pickTurnTeam === TeamEnum.TEAM1
                      ? TeamEnum.TEAM2
                      : TeamEnum.TEAM1,
                  timedout: true,
                },
              });
            });
          } else {
            ['team1_ban1', 'team2_ban1'].forEach((teamPick) => {
              const team = teamPick.split('_')[0];
              const pick = teamPick.split('_')[1];

              if (draftSession.pokemons) {
                const notSelectedPokemonList = draftSession.pokemons.filter(
                  (pkmn) => pkmn.picked === undefined
                );

                let randomNumber;
                do {
                  randomNumber = Math.random() * notSelectedPokemonList.length;
                } while (!(randomNumber < notSelectedPokemonList.length));

                const pokemon =
                  notSelectedPokemonList[Math.round(randomNumber) - 1];

                timedoutSelection.push({ team, pick, pokemon });
              } else {
                console.warn('pokemon list empty');
              }
            });

            selectBans({
              io,
              payload: {
                draftSessionId: sessionId,
                bans: timedoutSelection,
                timedout: true,
              },
            });
          }

          const limitTurn =
            draftSession.draftType !== 'individual'
              ? PICK_ORDER_SIMULTANEOUSLY_BAN.length
              : PICK_ORDER_ALTERNATE_BAN.length;

          if (pickTurn.turn < limitTurn - 1) {
            // RESET COUNTDOWN
            updateDraftStatus({
              io,
              payload: {
                sessionId: draftSession._id,
                draftStatus: DRAFT_STATUS.STARTED,
                pickTurnTeam:
                  pickTurnTeam === TeamEnum.TEAM1
                    ? TeamEnum.TEAM2
                    : TeamEnum.TEAM1,
              },
            });
          } else if (pickTurn.turn === limitTurn) {
            draftSessionCountdown.draftStatus = DRAFT_STATUS.FINISHED;
            draftSessionCountdown.countdown = 0;

            updateDraftStatus({
              io,
              payload: {
                sessionId: draftSession._id,
                draftStatus: DRAFT_STATUS.FINISHED,
                pickTurnTeam:
                  pickTurnTeam === TeamEnum.TEAM1
                    ? TeamEnum.TEAM2
                    : TeamEnum.TEAM1,
              },
            });
          }

          updateDraftSession({ io, draftSession });
        }
      }, 1000);
      break;

    case DRAFT_STATUS.PAUSED:
      draftSessionCountdown.draftStatus = DRAFT_STATUS.PAUSED;
      break;

    case DRAFT_STATUS.FINISHED:
      draftSession.draftStatus = DRAFT_STATUS.FINISHED;
      clearInterval(draftSessionCountdown.interval);
      io.to(`${sessionId}`).emit('update-draft-countdown', {
        draftStatus: draftSessionCountdown.draftStatus,
        countdown: 0,
        pickTurnTeam:
          pickTurnTeam === TeamEnum.TEAM1 ? TeamEnum.TEAM2 : TeamEnum.TEAM1,
      });
      break;

    default:
      console.warn('unknown-draft-status', { sessionId, draftStatus });
  }
}

async function selectBans({ io, payload: { draftSessionId, bans, timedout } }) {
  !draftSessionsCountdown[draftSessionId] &&
    (draftSessionsCountdown[draftSessionId] = {});
  const draftSessionCountdown = draftSessionsCountdown[draftSessionId];
  const draftSession = await getDraftSession({ draftSessionId });

  const canPickPokemon = draftSession.draftType !== 'spectator';

  if (
    (!timedout && !canPickPokemon) ||
    draftSession.draftType === 'spectator' ||
    draftSessionCountdown.draftStatus !== DRAFT_STATUS.STARTED
  ) {
    return;
  }

  if (draftSession && draftSession.pokemons) {
    for (let i = 0; i < bans.length; i++) {
      const { team, pokemon, pick } = bans[i];

      if (draftSession[team][pick].name === undefined) {
        draftSession[team][pick] = pokemon;

        const selectedPokemon = draftSession.pokemons.find(
          (pkmn) => pkmn.name === pokemon.name
        );

        selectedPokemon && (selectedPokemon.picked = team);
      }
    }

    const finishTurn =
      draftSession.team1.ban1.name !== undefined &&
      draftSession.team2.ban1.name !== undefined;

    if (finishTurn) {
      draftSession.pickTurn = draftSession.pickTurn + 1;

      if (draftSession.team1.ban1.name === draftSession.team2.ban1.name) {
        const selectedPokemon = draftSession.pokemons.find(
          (pkmn) => pkmn.name === draftSession.team1.ban1.name
        );

        selectedPokemon && (selectedPokemon.picked = TeamEnum.BOTH);
      }

      if (
        draftSessionCountdown &&
        draftSessionCountdown.draftStatus === DRAFT_STATUS.STARTED
      ) {
        io.to(`${draftSession._id}`).emit('update-draft-countdown', {
          draftStatus: DRAFT_STATUS.STARTED,
          countdown: MAX_COUNTDOWN_TIMER,
          pickTurnTeam: TeamEnum.TEAM1,
        });
        updateDraftStatus({
          io,
          payload: {
            sessionId: draftSession._id,
            draftStatus: DRAFT_STATUS.STARTED,
            pickTurnTeam: TeamEnum.TEAM1,
          },
        });
      }

      updateDraftSession({ io, draftSession });
    } else {
      let messateToSpecifiedTeam;

      if (draftSession.team1.ban1.name !== undefined) {
        messateToSpecifiedTeam = TeamEnum.TEAM1;
      } else if (draftSession.team2.ban1.name !== undefined) {
        messateToSpecifiedTeam = TeamEnum.TEAM2;
      }

      updateDraftSession({ io, draftSession, messateToSpecifiedTeam });
    }
  }
}

async function selectPick({
  io,
  payload: { draftSessionId, pokemon, selectedTeam, timedout },
}) {
  !draftSessionsCountdown[draftSessionId] &&
    (draftSessionsCountdown[draftSessionId] = {});
  const draftSessionCountdown = draftSessionsCountdown[draftSessionId];
  const draftSession = await getDraftSession({ draftSessionId });

  const PICK_ORDER =
    draftSession.draftType !== 'individual'
      ? PICK_ORDER_SIMULTANEOUSLY_BAN
      : PICK_ORDER_ALTERNATE_BAN;
  const { team, picks } = PICK_ORDER[draftSession.pickTurn];
  const canPickPokemon =
    (team === selectedTeam || draftSession.draftType === 'individual') &&
    !pokemon.picked;

  if (
    (!timedout &&
      !canPickPokemon &&
      draftSession.draftType === 'professional') ||
    draftSession.draftType === 'spectator' ||
    (draftSession.draftType !== 'individual' &&
      draftSessionCountdown.draftStatus !== DRAFT_STATUS.STARTED)
  ) {
    return;
  }

  if (draftSession && draftSession.pokemons) {
    const teamPickSelected = draftSession[team];

    for (let i = 0; i < picks.length; i++) {
      const pick = picks[i];

      if (teamPickSelected[pick].name === undefined) {
        teamPickSelected[pick] = pokemon;
        currentPickTurnSelected = pick;

        const selectedPokemon = draftSession.pokemons.find(
          (pkmn) => pkmn.name === pokemon.name
        );
        selectedPokemon && (selectedPokemon.picked = team);
        break;
      }
    }

    const finishTurn = picks.every(
      (pick) => teamPickSelected[pick].name !== undefined
    );

    if (finishTurn) {
      const nextPickTurn = draftSession.pickTurn + 1;

      if (nextPickTurn < PICK_ORDER.length) {
        draftSession.pickTurn = nextPickTurn;

        // why if draftStatus = started?
        if (
          draftSessionCountdown &&
          draftSessionCountdown.draftStatus === DRAFT_STATUS.STARTED
        ) {
          io.to(`${draftSession._id}`).emit('update-draft-countdown', {
            draftStatus: DRAFT_STATUS.STARTED,
            countdown: MAX_COUNTDOWN_TIMER,
            pickTurnTeam:
              selectedTeam === TeamEnum.TEAM1 ? TeamEnum.TEAM2 : TeamEnum.TEAM1,
          });
          updateDraftStatus({
            io,
            payload: {
              sessionId: draftSession._id,
              draftStatus: DRAFT_STATUS.STARTED,
              pickTurnTeam:
                selectedTeam === TeamEnum.TEAM1
                  ? TeamEnum.TEAM2
                  : TeamEnum.TEAM1,
            },
          });
        }
      } else {
        draftSession.draftStatus = DRAFT_STATUS.FINISHED;
        draftSessionCountdown.countdown = MAX_COUNTDOWN_TIMER;
        draftSessionCountdown.draftStatus = DRAFT_STATUS.FINISHED;

        updateDraftStatus({
          io,
          payload: {
            sessionId: draftSession._id,
            draftStatus: DRAFT_STATUS.FINISHED,
            pickTurnTeam:
              selectedTeam === TeamEnum.TEAM1 ? TeamEnum.TEAM2 : TeamEnum.TEAM1,
          },
        });
      }
    }

    updateDraftSession({ io, draftSession });
  }
}

async function updateDraftSession({
  io,
  draftSession,
  messateToSpecifiedTeam,
}) {
  let draftSessionToUpdate = {};
  Object.keys(draftSession)
    .filter((key) => key !== '_id')
    .map((key) => (draftSessionToUpdate[key] = draftSession[key]));

  let result;
  let room = `${draftSession._id}`;

  if (messateToSpecifiedTeam) {
    room = `${room}_${messateToSpecifiedTeam}`;
  }

  if (draftSession.draftType === 'individual') {
    result = true;
  } else {
    result = await updateDraft({
      sessionId: draftSession._id,
      payload: draftSessionToUpdate,
    });
  }

  if (result) {
    io.to(room).emit('draft-update', draftSession);
  } else {
  }
}

module.exports = {
  initDraftSocket,
};
