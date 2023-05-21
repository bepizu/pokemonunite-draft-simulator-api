const { POKEMONS } = require('../config/constants');
const {
  findOne,
  insert,
  update,
  IndexType,
} = require('../services/databases/mongodb');

async function getDraft({ sessionId }) {
  const query = { _id: new IndexType(sessionId) };
  return await findOne('drafts', query);
}

async function createDraft({ payload }) {
  const pokemons = POKEMONS.filter((pkmn) => pkmn.active).map((pkmn) =>
    Object.assign({}, pkmn)
  );
  return await insert('drafts', {
    ...payload,
    pokemons,
    connections: { team1: '', team2: '' },
    createdAt: new Date(),
  });
}

async function updateDraft({ sessionId, payload }) {
  const query = { _id: new IndexType(sessionId) };
  return await update('drafts', query, { ...payload, updatedAt: new Date() });
}

async function initDraft({ sessionId, type }) {
  const query = { _id: new IndexType(sessionId) };
  return await findOne('drafts', query);
}

module.exports = {
  getDraft,
  createDraft,
  updateDraft,
  initDraft,
};
