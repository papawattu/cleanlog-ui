import HomePageView from '../views/homePage.js'
import WelcomePageView from '../views/welcomePage.js'
import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'

export default function CreateHomepageController({ viewWrapper }) {
  return (req, res) => {
    if (req.session.user) {
      logger.debug(
        `User ${req.session.user} logged in, session ${req.session.id}`
      )
      res.setHeader('HX-Trigger', 'navUpdate')
      res.send(
        viewWrapper({
          user: req.session.user,
          isHTMX: isHTMX(req),
          content: WelcomePageView({ user: req.session.user }),
        })
      )
      return
    }
    res.send(viewWrapper({ isHTMX: isHTMX(req), content: HomePageView() }))
  }
}
