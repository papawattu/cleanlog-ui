import { titleHelper } from '../helpers/helpers.js'

export default ({ title = 'Home Page' } = {}) => {
  return String.raw`${titleHelper(
    title
  )}<main><h1>Welcome to the Home Page</h1><button hx-get="/login" hx-swap="outerHTML">Login</button></main>`
}
