import LoginView from '../views/loginView.js'
import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'

export default function CreateLoginController({
  viewWrapper,
  authenticate = () => true,
  sucessfulView,
}) {
  return async (req, res) => {
    if (req.method === 'POST') {
      if (!(await authenticate(req.body.username, req.body.password))) {
        res.send(
          viewWrapper({
            isHTMX: isHTMX(req),
            content: LoginView({ message: 'Invalid username or password' }),
          })
        )
        return
      }
      req.session.user = req.body.username
      logger.debug(
        `User ${req.session.user} logged in, session ${req.session.id}`
      )
      req.session.save((err) => {
        if (err) {
          logger.error(`Session save error: ${err}`)
          res.status(500).send('Internal Server Error')
          return
        }
        res.setHeader('HX-Trigger', 'navUpdate')
        res.send(
          viewWrapper({
            user: req.session.user,
            isHTMX: isHTMX(req),
            content: sucessfulView({ user: req.session.user }),
          })
        )
      })
    }
    if (req.method === 'GET') {
      res.send(viewWrapper({ isHTMX: isHTMX(req), content: LoginView() }))
      return
    }
  }
}
