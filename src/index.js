import App from './app.js'

const app = new App({ port: process.env.PORT || 3000 })

app.init()

process.on('SIGINT', () => {
  app.stop()
})
