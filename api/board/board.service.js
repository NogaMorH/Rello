const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const collection = await getBoardCollection()
        const boards = await collection.find().toArray()
        const miniBoards = boards.map(board => {
            const { _id, title, isStarred } = board
            return {
                _id,
                title,
                isStarred
            }
        })
        return miniBoards
    } catch (err) {
        logger.error('Cannot find boards in board service', err)
        throw err
    }
}

async function getBoardById(boardId) {
    try {
        const collection = await getBoardCollection()
        const board = await collection.findOne({ _id: ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error('Cannot find board in board service', err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await getBoardCollection()
        const criteria = { _id: ObjectId(boardId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`Cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await getBoardCollection()
        await collection.insertOne(board)
        return { msg: 'Added board successfully' }
    } catch (err) {
        logger.error('Cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        var id = ObjectId(board._id)
        delete board._id
        const collection = await getBoardCollection()
        await collection.updateOne({ _id: id }, { $set: { ...board } })
        return { msg: 'Board updated successfully' }
    } catch (err) {
        logger.error(`Cannot update board ${id}`, err)
        throw err
    }
}

async function getBoardCollection() {
    return await dbService.getCollection('board')
}

module.exports = {
    query,
    getBoardById,
    remove,
    add,
    update
}