import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'
export default function LogoutController({ viewWrapper }) {
  return (req, res) => {
    if (req.method === 'GET') {
      logger.debug(
        `User ${req.session.user} logged out, session ${req.session.id}`
      )
      req.session.destroy((err) => {
        if (err) {
          res.status(500).send('Error logging out')
          return
        }
        res.redirect('/')
        return
      })
    } else {
      res.status(405).send('Method Not Allowed')
    }
  }
}
