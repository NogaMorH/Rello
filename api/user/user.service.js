const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await getUserCollection()
        let users = await collection.find(criteria).toArray()
        if (users.length > 8) users = users.slice(0, 8)
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            user._id = user._id.toString()
            return user
        })
        return users
    } catch (err) {
        logger.error('Cannot find users', err)
        throw err
    }
}

async function getUserById(userId) {
    try {
        const collection = await getUserCollection()
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        user._id = user._id.toString()
        return user
    } catch (err) {
        logger.error(`Error while finding user by id: ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            ...user,
            _id: ObjectId(user._id)
        }
        const collection = await getUserCollection()
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return { msg: 'User updated successfully' }
    } catch (err) {
        logger.error(`Cannot update user ${user._id}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await getUserCollection()
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`Cannot remove user ${userId}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const collection = await getUserCollection()
        await collection.insertOne(user)
        return user
    } catch (err) {
        logger.error('Cannot insert user', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await getUserCollection()
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`Error while finding user by username: ${username}`, err)
        throw err
    }
}

async function getByEmail(email) {
    try {
        const collection = await getUserCollection()
        const user = await collection.findOne({ email })
        return user
    } catch (err) {
        logger.error(`Error while finding user by username: ${username}`, err)
        throw err
    }
}

async function getUserCollection() {
    return await dbService.getCollection('user')
}

function _buildCriteria({ text }) {
    const criteria = {}
    if (text) {
        const txtCriteria = { $regex: text, $options: 'i' }
        criteria.fullName = txtCriteria
        return criteria
    }
}

module.exports = {
    query,
    getUserById,
    update,
    remove,
    add,
    getByUsername,
    getByEmail
}   