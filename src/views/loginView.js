import { titleHelper } from '../helpers/helpers.js'
export default ({
  title = 'Login',
  user = null,
} = {}) => String.raw`<main id="main">
    <h3>Please Login</h3>
        <form hx-post="/login" hx-target="#main">
            <input name="username" type="text" placeholder="Username" required>
            <input name="password" type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>${titleHelper(title)}
    </main>`
