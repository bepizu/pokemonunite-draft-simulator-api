const { Router } = require('express')
const { createDraft, getDraft, updateDraft } = require('./models')

const { insert } = require('../services/databases/mongodb')
const { OKResponse, ErrorResponse } = require('../utils/requests')

const router = Router()

router.get("/:sessionId", async function (req, res) {
  const {sessionId} = req.params

  try {
    const draftSessionResponse = await getDraft({sessionId})

    if (draftSessionResponse) {
      res.status(200).json(OKResponse(draftSessionResponse))
    } else {
      res.status(404).json(ErrorResponse(new Error("Draft Session not found")))
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error))
  }
})

router.post("/", async function (req, res) {
  const { body } = req
      
  try {
    const insertedId = await createDraft({payload: body})
    res.status(200).json(OKResponse({ _id: insertedId }))
  } catch (error) {
    res.status(500).json(ErrorResponse(error))
  }
})

router.put("/:sessionId", async function (req, res) {
  const { sessionId } = req.params
  const { body } = req.body

  try {
    const draftSessionResponse = await updateDraft({ sessionId, payload: body })

    if (draftSessionResponse) {
      res.status(200).json(OKResponse())
    } else {
      res.status(409).json(ErrorResponse(new Error("Draft Session not updated")))
    }
  } catch (error) {
    res.status(500).json(ErrorResponse(error))
  }
})

module.exports = router