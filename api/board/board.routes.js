const express = require('express')
const { removeBoard, addBoard, updateBoard, getBoardById, getMiniBoards } = require('./board.controller')
const router = express.Router()

router.get('/', getMiniBoards)
router.get('/:id', getBoardById)
router.delete('/:id', removeBoard)
router.post('/', addBoard)
router.put('/:id', updateBoard)

module.exports = router