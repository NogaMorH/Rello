const express = require('express')
const router = express.Router()
const { getUsers, getUser, updateUser, deleteUser, addUser } = require('./user.controller')

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/', addUser)

module.exports = router