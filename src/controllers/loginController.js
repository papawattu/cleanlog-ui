import LoginView from '../views/loginView.js'
import WelcomePageView from '../views/welcomePage.js'
import { isHTMX } from '../helpers/helpers.js'

export default function CreateLoginController({ viewWrapper }) {
  return (req, res) => {
    if (req.method === 'POST') {
      // Do something with the login form data
      res.send(
        viewWrapper({
          isHTMX: isHTMX(req),
          content: WelcomePageView({ user: req.body.username }),
        })
      )
    }
    if (req.method === 'GET') {
      res.send(viewWrapper({ isHTMX: isHTMX(req), content: LoginView() }))
    }
  }
}
