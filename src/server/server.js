import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export default function Server({ port, controllers } = {}) {
  const router = express.Router()
  let server = null
  return {
    start: () => {
      console.log('Server is starting')
      const app = express()

      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))

      console.log('Adding controllers')
      controllers.forEach((controller) => {
        console.log(
          `Adding controller for path ${controller.path} ${controller.router}`
        )
        app.use(controller.path, controller.router)
      })

      server = app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
      })
    },
    stop: () => {
      console.log('Server is stopping')
      if (server) server.close()
    },
    router: () => router,
  }
}
