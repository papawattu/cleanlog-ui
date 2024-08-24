import HomePageView from '../views/homePage.js'
import { isHTMX } from '../helpers/helpers.js'

export default function CreateHomepageController({ viewWrapper }) {
  return (req, res) => {
    res.send(viewWrapper({ isHTMX: isHTMX(req), content: HomePageView() }))
  }
}
