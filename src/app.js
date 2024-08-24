import Server from './server/server.js'
import HomepageController from './controllers/homepage.js'

export default function App({ port = 3000 } = {}) {
  let isRunning = false

  const controllers = [{ path: '/', router: HomepageController() }]
  const server = new Server({ port, controllers })

  return {
    init: () => {
      isRunning = true
      console.log('App is starting')

      server.start()
    },
    stop: () => {
      isRunning = false
      server.stop()
      console.log('App is stopping')
    },
  }
}
