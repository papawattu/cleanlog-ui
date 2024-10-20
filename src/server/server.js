import express from 'express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from '../logger.js'
import HttpProxy from 'http-proxy'

export default function Server({ port, controllers } = {}) {
  const router = express.Router()
  let server = null
  return {
    start: () => {
      logger.info('Server is starting')
      const app = express()
      const proxy = HttpProxy.createProxyServer()

      app.use((req, res, next) => {
        if (req.url.includes('/api')) {
          proxy.web(req, res, { target: 'http://localhost:3001' })
        } else {
          next()
        }
      })
      
      app.use(expressSession({ secret: process.env.SECRET || 'secret' }))
      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(express.static('./public'))

      app.get('/worklog', (req, res) => {
        res.send([{ task: 'task1', time: '11:00', date: '1999-01-01' }, { task: 'task2', time: '11:00', date: '1999-01-01' }])
      })
      app.post('/addwork', (req, res) => {
        logger.debug('Adding work')
        res.render
        res.redirect('/html/worklog.html')
      })
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
