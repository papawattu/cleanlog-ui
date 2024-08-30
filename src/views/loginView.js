import { titleHelper } from '../helpers/helpers.js'
export default ({
  title = 'Login',
  user = null,
  message = '',
} = {}) => String.raw`${titleHelper(title)}<div id="main" class="">
    <div class="">
        <form id="loginform" hx-post="/login" hx-target="#main">
            <div class="">
                <label class="" for="username">
                        Username
                </label>
                <input name="username" type="text" placeholder="Username" required class="">
            </div>
            <div class="">
                <label class="" for="password">
                        Password
                </label>
                <input name="password" type="password" placeholder="Password" autocomplete required class="">
            </div>
            <div class="">
                <button type="submit" class="">
                        Login
                </button>
                ${message ? `<p id="message" class="">${message}</p>` : ''}
            </div>
        </form>
    </div>
</div>`
