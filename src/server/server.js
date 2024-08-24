import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export default function Server({ port } = {}) {
  let server = null
  return {
    start: () => {
      console.log('Server is starting')
      const app = express()

      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))
      app.get('/', (req, res) => {
        res.send('Hello World')
      })
      server = app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
      })
    },
    stop: () => {
      console.log('Server is stopping')
      if (server) server.close()
    },
  }
}
