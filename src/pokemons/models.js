const { findAll } = require("../services/databases/mongodb");

async function getPokemons({ onlyActive }) {
  try {
    const data = await findAll("pokemons", { ...(onlyActive !== undefined ? {active: onlyActive} : {}) })

    return data
  } catch (error) {
    console.error("error on getPokemons")
    return []
  }
}

module.exports = {
  getPokemons
}