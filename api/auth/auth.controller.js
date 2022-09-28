const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await authService.login(email, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.send(user)
    } catch (err) {
        logger.error('Failed to Login', err)
        let errorMsg
        if (err === 'Invalid username or password') errorMsg = 'Invalid username or password'
        else errorMsg = 'Failed to Login'
        res.status(500).send({ err: errorMsg })
    }
}

async function signup(req, res) {
    try {
        const credentials = req.body
        const account = await authService.signup(credentials)
        logger.debug(`auth.route - new account created: ${JSON.stringify(account)}`)
        const user = await authService.login(credentials.email, credentials.password)
        logger.info('User signup:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.send(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        let errorMsg
        if (err === 'Missing required signup information') errorMsg = 'Missing required signup information'
        else if (err === 'Username already taken') errorMsg = 'Username already taken'
        else errorMsg = 'Failed to signup'
        res.status(500).send({ err: errorMsg })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}