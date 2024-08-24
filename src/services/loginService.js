import logger from '../logger.js'

export default function CreateLoginAuthService() {
  return (username, password) => {
    logger.debug(`Authenticating user ${username}`)
    return username === 'user' && password === 'password'
  }
}
