const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ _id: ObjectId(boardId) })

        // var boards = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'aboutUser'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutUser'
        //     }
        // ]).toArray()
        // boards = boards.map(board => {
        //     board.byUser = { _id: board.byUser._id, fullname: board.byUser.fullname }
        //     board.aboutUser = { _id: board.aboutUser._id, fullname: board.aboutUser.fullname }
        //     delete board.byUserId
        //     delete board.aboutUserId
        //     return board
        // })
        return board
    } catch (err) {
        logger.error('Cannot find boards in board service', err)
        throw err
    }
}


async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const criteria = { _id: ObjectId(boardId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`Cannot remove board ${boardId}`, err)
        throw err
    }
}

module.exports = {
    query,
    remove
}