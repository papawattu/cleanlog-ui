import Server from './server/server.js'
import logger from './logger.js'
import CreateLoginAuthService from './services/loginService.js'
import CreateUserService from './services/userService.js'
import ControllerSetup from './controllers/controllerSetup.js'

const users = [
  { username: 'admin', password: 'admin' },
  { username: 'user', password: 'password' },
]
export default function App({ port = 3000 } = {}) {
  let isRunning = false

  const { findUser, validatePassword } = CreateUserService({ users })

  const loginAuthService = CreateLoginAuthService({
    findUser,
    validatePassword,
  })

  const controllers = ControllerSetup({ loginAuthService  })

  const server = new Server({ port, controllers })

  return {
    init: () => {
      if (isRunning) {
        logger.warn('Clean Log Web App is already running')
        return
      }
      isRunning = true
      logger.info('Clean Log Web App is starting')

      server.start()
    },
    stop: () => {
      if (!isRunning) {
        logger.warn('Clean Log Web App is already stopped')
        return
      }
      isRunning = false
      logger.info('Clean Log Web App is stopping')
      server.stop()
      logger.info('Clean Log Web App stopped')
    },
    isRunning: () => isRunning,
  }
}
