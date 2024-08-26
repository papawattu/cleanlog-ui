import NavFragment from '../views/fragments/navFragment.js'
import { isHTMX } from '../helpers/helpers.js'
import logger from '../logger.js'

export default function CreateNavController({ viewWrapper }) {
  return (req, res) => {
    const { user } = req.session

    logger.debug(`NavController ${req.method} ${req.url}`)
    if (req.method === 'GET' && req.url === '/nav' && isHTMX(req)) {
      res.send(
        viewWrapper({
          user,
          isHTMX: true,
          content: NavFragment({ user }),
        })
      )
      return
    }
    res.status(404).send('Not Found')
  }
}
