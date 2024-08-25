import logger from '../logger.js'

export default function CreateLoginAuthService({
  findUser,
  validatePassword,
} = {}) {
  return async (username, password) => {
    logger.debug(`Authenticating user ${username}`)

    const user = await findUser(username)

    if (!user) {
      logger.debug(`User ${username} not found`)
      return false
    }
    if (!(await validatePassword(user, password))) {
      logger.debug(`Password for user ${username} is incorrect`)
      return false
    }
    return true
  }
}
