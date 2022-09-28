const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'j3l5nnk6')

async function login(email, password) {
    try {
        logger.debug(`auth.service - login with email: ${email}`)
        const user = await userService.getByEmail(email)
        if (!user) return Promise.reject('Invalid email or password')
        const match = await bcrypt.compare(password, user.password)
        if (!match) return Promise.reject('Invalid email or password')
        delete user.password
        user._id = user._id.toString()
        return user
    } catch (err) {
        throw err
    }
}

async function signup({
    username,
    password,
    email,
    firstName,
    lastName,
    imgUrl = 'http://res.cloudinary.com/dkbts8x37/image/upload/v1664182991/yyi2enb9jiel3ifixxhe.png' }) {

    try {
        const saltRounds = 10
        console.log('username:', username)
        const fullName = `${firstName} ${lastName}`
        logger.debug(`auth.service - signup with username: ${username}, fullName: ${fullName}`)
        if (!username || !password || !firstName || !lastName || !email) return Promise.reject('Missing required signup information')

        const userExist = await userService.getByUsername(username)
        if (userExist) return Promise.reject('Username already taken')

        const hash = await bcrypt.hash(password, saltRounds)
        return userService.add({ username, password: hash, fullName, email, imgUrl })
    } catch (err) {
        throw err
    }
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

module.exports = {
    login,
    signup,
    getLoginToken
}