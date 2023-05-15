const { findOne, update, IndexType } = require("../services/databases/mongodb")


async function getDraft({sessionId}) {
  const query = {_id: new IndexType(sessionId)}
  return await findOne("drafts", query)
}

async function createDraft({payload}) {
  return await insert("drafts", payload)
}

async function updateDraft({sessionId, payload}) {
  const query = {_id: new IndexType(sessionId)}
  return await update("drafts", query, payload)
}

async function initDraft({ sessionId, type }) {
  const query = {_id: new IndexType(sessionId)}
  return await findOne("drafts", query)
}

module.exports = {
  getDraft,
  createDraft,
  updateDraft,
  initDraft
}