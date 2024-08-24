import Server from './server/server.js'
import CreateHomepageController from './controllers/homePageController.js'
import CreateLoginController from './controllers/loginController.js'
import CreateViewWrapper from './views/viewWrapper.js'
import Layout from './views/layout.js'
import logger from './logger.js'
import CreateLoginAuthService from './services/loginService.js'

export default function App({ port = 3000 } = {}) {
  let isRunning = false

  const viewWrapper = CreateViewWrapper({ layout: Layout })
  const controllers = [
    {
      path: '/login',
      router: CreateLoginController({
        viewWrapper,
        authenticate: CreateLoginAuthService(),
      }),
    },
    { path: '/', router: CreateHomepageController({ viewWrapper }) },
  ]
  const server = new Server({ port, controllers })

  return {
    init: () => {
      if (isRunning) {
        logger.warn('App is already running')
        return
      }
      isRunning = true
      logger.info('App is starting')

      server.start()
    },
    stop: () => {
      if (!isRunning) {
        logger.warn('App is already stopped')
        return
      }
      isRunning = false
      logger.info('App is stopping')
      server.stop()
      logger.info('App stopped')
    },
    isRunning: () => isRunning,
  }
}
