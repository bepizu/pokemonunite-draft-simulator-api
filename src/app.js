const { Server } = require("socket.io")
const express = require("express")
const httpServer = require('http')
const cors = require('cors')
const environment = require("./config/environment")
const { initDraftSocket } = require("./drafts/socket")
const draftController = require("./drafts/controllers")

function startApp() {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded())
  app.use(cors())

  app.use("/drafts", draftController)

  const server = httpServer.createServer(app)

  const io = new Server(server, {
    cors: {
      origin: '*'
    },
  })

  io.on("connection", async (socket) => {
    initDraftSocket({io, socket})
  })
  
  server.listen(environment.PORT, () => console.log(`Listening on ${environment.PORT} port`))
}

module.exports = {
  startApp
}