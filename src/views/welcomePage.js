import { titleHelper } from '../helpers/helpers.js'

export default ({ title = 'Welcome Page', user } = {}) => {
  return String.raw`${titleHelper(title)}<main><h3>Welcome back ${user}</main>`
}
