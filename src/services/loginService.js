import logger from '../logger.js'

export default function CreateLoginAuthService() {
  return {
    authenticate: (username, password) => {
      logger.debug(`Authenticating user ${username}`)
      return username === 'user' && password === 'password'
    },
  }
}
