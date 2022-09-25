const logger = require('../../services/logger.service')
const userService = require('../user/user.service')

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')
    delete user.password
    user._id = user._id.toString()
    return user
}

module.exports = {
    login
}