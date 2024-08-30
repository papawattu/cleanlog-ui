import LoginView from '../views/loginView.js'
import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client()
async function verify({ token }) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  })
  const payload = ticket.getPayload()
  const sub = payload['sub']
  const email = payload['email']
  const name = payload['name']
  const given_name = payload['given_name']
  const picture = payload['picture']
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
  logger.info(`Google login payload: ${JSON.stringify(payload)}`)
  logger.info(`Google login userid: ${sub}`)
  return {
    sub,
    email,
    name,
    given_name,
    picture,
  }
}

export default function CreateLoginController({
  viewWrapper,
  authenticate = () => true,
  sucessfulView,
}) {
  return async (req, res) => {
    if (req.method === 'POST') {
      if (req.url === '/login') {
        if (!(await authenticate(req.body.username, req.body.password))) {
          res.send(
            viewWrapper({
              isHTMX: isHTMX(req),
              content: LoginView({ message: 'Invalid username or password' }),
            })
          )
          return
        } else {
          req.session.user = {
            sub: req.body.username,
            given_name: req.body.username,
          }
        }
      } else {
        if (req.url === '/auth/google') {
          logger.info(`Google login ${JSON.stringify(req.body.credential)}`)
          if (!req.body.credential) {
            res.send(
              viewWrapper({
                isHTMX: isHTMX(req),
                content: LoginView({ message: 'Google login failed' }),
              })
            )
            return
          } else {
            const { sub, email, name, given_name, picture } = await verify({
              token: req.body.credential,
            })

            req.session.user = { sub, email, name, given_name, picture }
          }
        }
      }

      logger.info(`User ${req.session.user} logged in`)
      logger.debug(
        `User ${req.session.user.sub} logged in, session ${req.session.id}`
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
