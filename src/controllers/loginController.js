import LoginView from '../views/loginView.js'
import WelcomePageView from '../views/welcomePage.js'
import { isHTMX } from '../helpers/helpers.js'

export default function CreateLoginController({
  viewWrapper,
  authenticate = () => true,
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
      res.send(
        viewWrapper({
          isHTMX: isHTMX(req),
          content: WelcomePageView({ user: req.body.username }),
        })
      )
      return
    }
    if (req.method === 'GET') {
      res.send(viewWrapper({ isHTMX: isHTMX(req), content: LoginView() }))
      return
    }
  }
}
