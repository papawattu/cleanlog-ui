import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from '../logger.js'

export default function Server({ port, controllers } = {}) {
  const router = express.Router()
  let server = null
  return {
    start: () => {
      logger.info('Server is starting')
      const app = express()

      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(express.static('./public'))

      logger.debug('Adding controllers')
      controllers.forEach((controller) => {
        logger.debug(`Adding controller for path ${controller.path}`)
        app.all(controller.path, controller.router)
      })

      server = app.listen(port, () => {
        logger.info(`Server is listening on port ${port}`)
      })
    },
    stop: () => {
      logger.info('Server is stopping')
      if (server) server.close()
    },
    router: () => router,
  }
}
