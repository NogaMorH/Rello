const logger = require('../../services/logger.service')
const boardService = require('./board.service')

async function getBoard(req, res) {
    try {
        const board = await boardService.query(req.params.id)
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


module.exports = {
    getBoard,
    removeBoard
}