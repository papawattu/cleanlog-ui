import { titleHelper } from '../helpers/helpers.js'

export default ({ title = 'Home Page', user = null } = {}) => {
  return String.raw`${titleHelper(
    title
  )}<main><h1>Cleaning Tracker</h1><button id="login" hx-get="/login" hx-swap="outerHTML">Login</button></main>`
}
