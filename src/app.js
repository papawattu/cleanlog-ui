import Server from './server/server.js'
import CreateHomepageController from './controllers/homePageController.js'
import CreateLoginController from './controllers/loginController.js'
import CreateViewWrapper from './views/viewWrapper.js'
import Layout from './views/layout.js'
import logger from './logger.js'

export default function App({ port = 3000 } = {}) {
  let isRunning = false

  const viewWrapper = CreateViewWrapper({ layout: Layout })
  const controllers = [
    { path: '/login', router: CreateLoginController({ viewWrapper }) },
    { path: '/', router: CreateHomepageController({ viewWrapper }) },
  ]
  const server = new Server({ port, controllers })

  return {
    init: () => {
      isRunning = true
      logger.info('App is starting')

      server.start()
    },
    stop: () => {
      isRunning = false
      logger.info('App is stopping')
      server.stop()
      logger.info('App stopped')
    },
  }
}
