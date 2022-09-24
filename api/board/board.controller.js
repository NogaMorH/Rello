const logger = require('../../services/logger.service')
const boardService = require('./board.service')

async function getMiniBoards(req, res) {
    try {
        const miniBoards = await boardService.query()
        res.send(miniBoards)
    } catch (err) {
        logger.error('Cannot get boards', err)
        res.status(500).send({ error: 'Failed to get boards' })
    }
}

async function getBoardById(req, res) {
    try {
        const board = await boardService.getBoardById(req.params.id)
        res.send(board)
    } catch (err) {
        logger.error('Cannot get board', err)
        res.status(500).send({ error: 'Failed to get board' })
    }
}

async function removeBoard(req, res) {
    try {
        const deletedCount = await boardService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove board' })
        }
    } catch (err) {
        logger.error('Failed to delete board', err)
        res.status(500).send({ err: 'Failed to delete board' })
    }
}

async function addBoard(req, res) {
    try {
        var board = req.body
        await boardService.add(board)
        res.send({ msg: 'Added board successfully' })
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}

async function updateBoard(req, res) {
    console.log('hi')
    try {
        const board = req.body
        console.log('board:', board)
        await boardService.update(board)
        res.json({ msg: 'Updated board successfully' })
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

module.exports = {
    getMiniBoards,
    getBoardById,
    removeBoard,
    addBoard,
    updateBoard
}