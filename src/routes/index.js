import { Router } from 'express'
import worklog from './worklog/worklog.js'

const router = Router()

worklog(router)

router.get('/', (req, res) => {
  res.redirect('/view/worklog')
})

export { router }
