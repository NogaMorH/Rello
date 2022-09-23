const express = require('express')
const { getBoard, removeBoard } = require('./board.controller')
const router = express.Router()

router.get('/:id', getBoard)
router.delete('/:id', removeBoard)

module.exports = router