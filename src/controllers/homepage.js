import HomePageView from '../views/homepage.js'

export default function HomepageController({
  viewWrapper = (view) => view,
} = {}) {
  return (req, res) => {
    res.send(viewWrapper(HomePageView()))
  }
}
