import { titleHelper } from '../helpers/helpers.js'

export default ({ title = 'Home Page' } = {}) => {
  return String.raw`${titleHelper(
    title
  )}<main><h1>Cleaning Tracker</h1><button hx-get="/login" hx-swap="outerHTML">Login</button></main>`
}
