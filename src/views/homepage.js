import { titleHelper } from './helpers/helpers.js'

export default HomePageView = ({ title = 'Home Page' } = {}) => {
  return String.raw`${titleHelper(
    title
  )}<main><h1>Welcome to the Home Page</h1></main>`
}
