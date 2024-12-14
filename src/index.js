import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import es6Renderer from 'express-es6-template-engine'
import cookieParser from 'cookie-parser'

import 'dotenv/config'

import { router } from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  console.log('Request Type:', req.method)
  console.log('Request URL:', req.originalUrl)
  console.log('Request Query:', req.query)
  next()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))
app.engine('html', es6Renderer)
app.set('views', 'view')
app.set('view engine', 'html')

app.use(router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
