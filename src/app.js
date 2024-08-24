import Server from './server/server.js'

export default function App({ port = 3000 } = {}) {
  let isRunning = false
  const server = new Server({ port })
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
