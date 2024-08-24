import App from './app.js'

const app = new App()

app.init()

process.on('SIGINT', () => {
  app.stop()
})
