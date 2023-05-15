const MAX_COUNTDOWN_TIMER = 20
const DRAFT_STATUS = {
  NOT_STARTED: 0,
  STARTED: 1,
  PAUSED: 2,
  FINISHED: 3
}
const TeamEnum = {
  TEAM1: "team1",
  TEAM2: "team2",
}

const PICK_ORDER = [
  { turn: 0, team: TeamEnum.TEAM1, picks: ['ban1']},
  { turn: 1, team: TeamEnum.TEAM2, picks: ['ban1']},
  { turn: 2, team: TeamEnum.TEAM1, picks: ['pick1']},
  { turn: 3, team: TeamEnum.TEAM2, picks: ['pick1','pick2']},
  { turn: 4, team: TeamEnum.TEAM1, picks: ['pick2','pick3']},
  { turn: 5, team: TeamEnum.TEAM2, picks: ['pick3','pick4']},
  { turn: 6, team: TeamEnum.TEAM1, picks: ['pick4','pick5']},
  { turn: 7, team: TeamEnum.TEAM2, picks: ['pick5']}
]

const POKEMONS = [
  {
    name: "Venusaur",
    images: {
      main: "/roster-venusaur.png",
      big: "/roster-venusaur-2x.png",
      complete: "/stat-venusaur.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4.5,
      endurance: 2,
      mobility: 2,
      scoring: 2.5,
      support: 1
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Charizard",
    images: {
      main: "/roster-charizard.png",
      big: "/roster-charizard-2x.png",
      complete: "/stat-charizard.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 3.5,
      endurance: 3,
      mobility: 2.5,
      scoring: 3,
      support: 0.5
    },
    difficulty: 1,
    tags: ["allrounder", "melee"]
  },
  {
    name: "Blastoise",
    images: {
      main: "/roster-blastoise.png",
      big: "/roster-blastoise-2x.png",
      complete: "/stat-blastoise.png"
    },
    active: true,
    battleType: 4,
    tags: ["defender", "ranged"],
    difficulty: 2,
    stats: {
      offense: 2,
      endurance: 3.5,
      mobility: 2,
      scoring: 2,
      support: 3
    }
  },
  {
    name: "Pikachu",
    images: {
      main: "/roster-pikachu.png",
      big: "/roster-pikachu-2x.png",
      complete: "/stat-pikachu.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4.5,
      endurance: 1.5,
      mobility: 2.5,
      scoring: 2,
      support: 1.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 1
  },
  {
    name: "Clefable",
    images: {
      main: "/roster-clefable.png",
      big: "/roster-clefable-2x.png",
      complete: "/stat-clefable.png"
    },
    active: true,
    battleType: 5,
    stats: {
      offense: 2,
      endurance: 3,
      mobility: 1.5,
      scoring: 1.5,
      support: 4.5
    },
    tags: ["supporter", "melee"],
    difficulty: 1
  },
  {
    name: "Alolan Ninetales",
    images: {
      main: "/roster-alolan-ninetales.png",
      big: "/roster-alolan-ninetales-2x.png",
      complete: "/stat-alolan-ninetales.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 1.5,
      mobility: 1.5,
      scoring: 2.5,
      support: 3
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Wigglytuff",
    images: {
      main: "/roster-wigglytuff.png",
      big: "/roster-wigglytuff-2x.png",
      complete: "/stat-wigglytuff.png"
    },
    active: true,
    battleType: 5,
    stats: {
      offense: 1,
      endurance: 2.5,
      mobility: 2.5,
      scoring: 2,
      support: 4.5
    },
    tags: ["supporter", "ranged"],
    difficulty: 2
  },
  {
    name: "Machamp",
    images: {
      main: "/roster-machamp.png",
      big: "/roster-machamp-2x.png",
      complete: "/stat-machamp.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 4,
      endurance: 2.5,
      mobility: 2.5,
      scoring: 2.5,
      support: 1
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  },
  {
    name: "Slowbro",
    images: {
      main: "/roster-slowbro.png",
      big: "/roster-slowbro-2x.png",
      complete: "/stat-slowbro.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 1.5,
      endurance: 4,
      mobility: 1.5,
      scoring: 1.5,
      support: 4
    },
    tags: ["defender", "ranged"],
    difficulty: 2
  },
  {
    name: "Dodrio",
    images: {
      main: "/roster-dodrio.png",
      big: "/roster-dodrio-2x.png",
      complete: "/stat-dodrio.png"
    },
    active: true,
    battleType: 2,
    stats: {
      offense: 3,
      endurance: 2,
      mobility: 4,
      scoring: 4,
      support: 0.5
    },
    tags: ["speedster", "melee"],
    difficulty: 3
  },
  {
    name: "Gengar",
    images: {
      main: "/roster-gengar.png",
      big: "/roster-gengar-2x.png",
      complete: "/stat-gengar.png"
    },
    active: true,
    battleType: 2,
    stats: {
      offense: 3.5,
      endurance: 2,
      mobility: 4,
      scoring: 3,
      support: 0.5
    },
    tags: ["speedster", "melee"],
    difficulty: 3
  },
  {
    name: "Blissey",
    images: {
      main: "/roster-blissey.png",
      big: "/roster-blissey-2x.png",
      complete: "/stat-blissey.png"
    },
    active: true,
    battleType: 5,
    stats: {
      offense: 1,
      endurance: 3.5,
      mobility: 1.5,
      scoring: 1.5,
      support: 4.5
    },
    tags: ["supporter", "melee"],
    difficulty: 1
  },
  {
    name: "Mr. Mime",
    images: {
      main: "/roster-mr-mime.png",
      big: "/roster-mr-mime-2x.png",
      complete: "/stat-mr.mime.png"
    },
    active: true,
    battleType: 5
  },
  {
    name: "Scizor",
    images: {
      main: "/roster-scizor.png",
      big: "/roster-scizor-2x.png",
      complete: "/stat-scizor.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 4.5,
      endurance: 2.5,
      mobility: 4.5,
      scoring: 2.5,
      support: 1
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  },
  {
    name: "Lapras",
    images: {
      main: "/roster-lapras.png",
      big: "/roster-lapras-2x.png"
    },
    active: true,
    tags: ["defender", "ranged"],
    difficulty: 2,
    battleType: 4,
    stats: {
      offense: 3,
      endurance: 3.5,
      mobility: 2,
      scoring: 2,
      support: 3
    }
  },
  {
    name: "Snorlax",
    images: {
      main: "/roster-snorlax.png",
      big: "/roster-snorlax-2x.png",
      complete: "/stat-snorlax.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 1.5,
      endurance: 5,
      mobility: 2,
      scoring: 1.5,
      support: 2.5
    },
    tags: ["defender", "melee"],
    difficulty: 1
  },
  {
    name: "Dragonite",
    images: {
      main: "/roster-dragonite.png",
      big: "/roster-dragonite-2x.png",
      complete: "/stat-dragonite.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 4,
      endurance: 2.5,
      mobility: 2.5,
      scoring: 3,
      support: 0.5
    },
    tags: ["allrounder", "melee"],
    difficulty: 1
  },
  {
    name: "Mew",
    images: {
      main: "/roster-mew.png",
      big: "/roster-mew-2x.png",
      complete: "/stat-mew.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 2,
      mobility: 3,
      scoring: 2,
      support: 3
    },
    tags: ["attacker", "ranged"],
    difficulty: 1
  },
  {
    name: "Azumarill",
    images: {
      main: "/roster-azumarill.png",
      big: "/roster-azumarill-2x.png",
      complete: "/stat-azumarill.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 3,
      endurance: 3,
      mobility: 2.5,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["allrounder", "melee"],
    difficulty: 1
  },
  {
    name: "Espeon",
    images: {
      main: "/roster-espeon.png",
      big: "/roster-espeon-2x.png",
      complete: "/stat-espeon.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 2,
      mobility: 1.5,
      scoring: 2,
      support: 3
    },
    tags: ["attacker", "ranged"],
    difficulty: 1
  },
  {
    name: "Umbreon",
    images: {
      main: "/roster-umbreon.png",
      big: "/roster-umbreon-2x.png"
    },
    active: false
  },
  {
    name: "Mamoswine",
    images: {
      main: "/roster-mamoswine.png",
      big: "/roster-mamoswine-2x.png",
      complete: "/stat-mamoswine.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 2.5,
      endurance: 4,
      mobility: 2,
      scoring: 1.5,
      support: 2.5
    },
    tags: ["defender", "melee"],
    difficulty: 2
  },
  {
    name: "Tyranitar",
    images: {
      main: "/roster-tyranitar.png",
      big: "/roster-tyranitar-2x.png",
      complete: "/stat-tyranitar.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 4,
      endurance: 4,
      mobility: 2,
      scoring: 1.5,
      support: 1
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  },
  {
    name: "Gardevoir",
    images: {
      main: "/roster-gardevoir.png",
      big: "/roster-gardevoir-2x.png",
      complete: "/stat-gardevoir.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4.5,
      endurance: 1.5,
      mobility: 1.5,
      scoring: 3,
      support: 1.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Sableye",
    images: {
      main: "/roster-sableye.png",
      big: "/roster-sableye-2x.png",
      complete: "/stat-sableye.png"
    },
    active: true,
    battleType: 5,
    stats: {
      offense: 1,
      endurance: 2.5,
      mobility: 2.5,
      scoring: 3.5,
      support: 3.5
    },
    tags: ["supporter", "melee"],
    difficulty: 2
  },
  {
    name: "Absol",
    images: {
      main: "/roster-absol.png",
      big: "/roster-absol-2x.png",
      complete: "/stat-absol.png"
    },
    active: true,
    battleType: 2,
    stats: {
      offense: 3.5,
      endurance: 2,
      mobility: 4,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["speedster", "melee"],
    difficulty: 3
  },
  {
    name: "Garchomp",
    images: {
      main: "/roster-garchomp.png",
      big: "/roster-garchomp-2x.png",
      complete: "/stat-garchomp.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 3.5,
      endurance: 3.5,
      mobility: 2.5,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  },
  {
    name: "Lucario",
    images: {
      main: "/roster-lucario.png",
      big: "/roster-lucario-2x.png",
      complete: "/stat-lucario.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 3,
      endurance: 2.5,
      mobility: 3.5,
      scoring: 3,
      support: 0.5
    },
    tags: ["allrounder", "melee"],
    difficulty: 3
  },
  {
    name: "Glaceon",
    images: {
      main: "/roster-glaceon.png",
      big: "/roster-glaceon-2x.png",
      complete: "/stat-glaceon.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 2,
      mobility: 3,
      scoring: 1,
      support: 0.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Crustle",
    images: {
      main: "/roster-crustle.png",
      big: "/roster-crustle-2x.png",
      complete: "/stat-crustle.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 1.5,
      endurance: 4,
      mobility: 1.5,
      scoring: 2,
      support: 3
    },
    tags: ["defender", "melee"],
    difficulty: 1
  },
  {
    name: "Zoroark",
    images: {
      main: "/roster-zoroark.png",
      big: "/roster-zoroark-2x.png",
      complete: "/stat-zoroark.png"
    },
    active: true,
    battleType: 2,
    stats: {
      offense: 3.5,
      endurance: 1.5,
      mobility: 4,
      scoring: 2,
      support: 0.5
    },
    tags: ["speedster", "melee"],
    difficulty: 3
  },
  {
    name: "Chandelure",
    images: {
      main: "/roster-chandelure.png",
      big: "/roster-chandelure-2x.png",
      complete: "/stat-chandelure.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 5,
      endurance: 1,
      mobility: 1,
      scoring: 2,
      support: 3
    },
    tags: ["attacker", "ranged"],
    difficulty: 1
  },
  {
    name: "Delphox",
    images: {
      main: "/roster-delphox.png",
      big: "/roster-delphox-2x.png",
      complete: "/stat-delphox.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 1.5,
      mobility: 3,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 1
  },
  {
    name: "Greninja",
    images: {
      main: "/roster-greninja.png",
      big: "/roster-greninja-2x.png",
      complete: "/stat-greninja.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 2,
      mobility: 3,
      scoring: 3,
      support: 0.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 3
  },
  {
    name: "Talonflame",
    images: {
      main: "/roster-talonflame.png",
      big: "/roster-talonflame-2x.png",
      complete: "/stat-talonflame.png"
    },
    active: true,
    battleType: 2,
    stats: {
      offense: 2.5,
      endurance: 1.5,
      mobility: 5,
      scoring: 3.5,
      support: 0.5
    },
    tags: ["speedster", "melee"],
    difficulty: 1
  },
  {
    name: "Aegislash",
    images: {
      main: "/roster-aegislash.png",
      big: "/roster-aegislash-2x.png",
      complete: "/stat-aegislash.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 3.5,
      endurance: 2,
      mobility: 4,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["allrounder", "melee"],
    difficulty: 3
  },
  {
    name: "Sylveon",
    images: {
      main: "/roster-sylveon.png",
      big: "/roster-sylveon-2x.png",
      complete: "/stat-sylveon.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 3.5,
      endurance: 1.5,
      mobility: 1.5,
      scoring: 3.5,
      support: 3.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Goodra",
    images: {
      main: "/roster-goodra.png",
      big: "/roster-goodra-2x.png",
      complete: "/stat-goodra.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 2.5,
      endurance: 4,
      mobility: 2.5,
      scoring: 2.5,
      support: 2
    },
    tags: ["defender", "melee"],
    difficulty: 2
  },
  {
    name: "Trevenant",
    images: {
      main: "/roster-trevenant.png",
      big: "/roster-trevenant-2x.png",
      complete: "/stat-trevenant.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 2,
      endurance: 4,
      mobility: 2,
      scoring: 2.5,
      support: 2.5
    },
    tags: ["defender", "melee"],
    difficulty: 2
  },
  {
    name: "Hoopa",
    images: {
      main: "/roster-hoopa.png",
      big: "/roster-hoopa-2x.png",
      complete: "/stat-hoopa.png"
    },
    active: true,
    battleType: 5,
    stats: {
      offense: 3,
      endurance: 2,
      mobility: 3,
      scoring: 2,
      support: 3.5
    },
    tags: ["supporter", "ranged"],
    difficulty: 3
  },
  {
    name: "Decidueye",
    images: {
      main: "/roster-decidueye.png",
      big: "/roster-decidueye-2x.png",
      complete: "/stat-decidueye.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 3.5,
      endurance: 1.5,
      mobility: 1.5,
      scoring: 3.5,
      support: 3.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Tsareena",
    images: {
      main: "/roster-tsareena.png",
      big: "/roster-tsareena-2x.png",
      complete: "/stat-tsareena.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 3.5,
      endurance: 1.5,
      mobility: 1.5,
      scoring: 3.5,
      support: 3.5
    },
    tags: ["allrounder", "melee"],
    difficulty: 3
  },
  {
    name: "Comfey",
    images: {
      main: "/roster-comfey.png",
      big: "/roster-comfey-2x.png",
      complete: "/stat-comfey.png"
    },
    active: true,
    stats: {
      offense: 2,
      endurance: 3,
      mobility: 1.5,
      scoring: 1.5,
      support: 4.5
    },
    difficulty: 1,
    tags: ["supporter", "ranged"],
    battleType: 5
  },
  {
    name: "Buzzwole",
    images: {
      main: "/roster-buzzwole.png",
      big: "/roster-buzzwole-2x.png",
      complete: "/stat-buzzwole.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 4,
      endurance: 3,
      mobility: 2.5,
      scoring: 2,
      support: 2
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  },
  {
    name: "Zeraora",
    images: {
      main: "/roster-zeraora.png",
      big: "/roster-zeraora-2x.png",
      complete: "/stat-zeraora.png"
    },
    active: true,
    battleType: 2,
    stats: {
      offense: 3.5,
      endurance: 1.5,
      mobility: 4,
      scoring: 3,
      support: 0.5
    },
    tags: ["speedster", "melee"],
    difficulty: 3
  },
  {
    name: "Cinderace",
    images: {
      main: "/roster-cinderace.png",
      big: "/roster-cinderace-2x.png",
      complete: "/stat-cinderace.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 1.5,
      mobility: 3,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 1
  },
  {
    name: "Greedent",
    images: {
      main: "/roster-greedent.png",
      big: "/roster-greedent-2x.png",
      complete: "/stat-greedent.png"
    },
    active: true,
    battleType: 4,
    stats: {
      offense: 4,
      endurance: 1.5,
      mobility: 2,
      scoring: 1,
      support: 1
    },
    tags: ["defender", "melee"],
    difficulty: 3
  },
  {
    name: "Eldegoss",
    images: {
      main: "/roster-eldegoss.png",
      big: "/roster-eldegoss-2x.png",
      complete: "/stat-eldegoss.png"
    },
    active: true,
    battleType: 5,
    stats: {
      offense: 1.5,
      endurance: 2,
      mobility: 2.5,
      scoring: 2.5,
      support: 4
    },
    tags: ["supporter", "ranged"],
    difficulty: 1
  },
  {
    name: "Cramorant",
    images: {
      main: "/roster-cramorant.png",
      big: "/roster-cramorant-2x.png",
      complete: "/stat-cramorant.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 3,
      mobility: 3,
      scoring: 1.5,
      support: 1
    },
    tags: ["attacker", "ranged"],
    difficulty: 3
  },
  {
    name: "Duraludon",
    images: {
      main: "/roster-duraludon.png",
      big: "/roster-duraludon-2x.png",
      complete: "/stat-duraludon.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 3.5,
      endurance: 3.5,
      mobility: 2.5,
      scoring: 2.5,
      support: 0.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 2
  },
  {
    name: "Dragapult",
    images: {
      main: "/roster-dragapult.png",
      big: "/roster-dragapult-2x.png",
      complete: "/stat-dragapult.png"
    },
    active: true,
    battleType: 1,
    stats: {
      offense: 4,
      endurance: 2.5,
      mobility: 4,
      scoring: 1.5,
      support: 0.5
    },
    tags: ["attacker", "ranged"],
    difficulty: 3
  },
  {
    name: "Zacian",
    images: {
      main: "/roster-zacian.png",
      big: "/roster-zacian-2x.png",
      complete: "/stat-zacian.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 5,
      endurance: 4,
      mobility: 3,
      scoring: 1,
      support: 2
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  },
  {
    name: "Urshifu",
    images: {
      main: "/roster-urshifu.png",
      big: "/roster-urshifu-2x.png",
      complete: "/stat-urshifu.png"
    },
    active: true,
    battleType: 3,
    stats: {
      offense: 4.5,
      endurance: 3,
      mobility: 2.5,
      scoring: 2.5,
      support: 1
    },
    tags: ["allrounder", "melee"],
    difficulty: 2
  }
]

module.exports = {
  MAX_COUNTDOWN_TIMER,
  DRAFT_STATUS,
  PICK_ORDER,
  POKEMONS,
}