import { titleHelper } from '../helpers/helpers.js'

export default ({ title = 'Home Page', user = null } = {}) => {
  return String.raw`${titleHelper(title)}

      <div class="p-4">
        <h1 class="text-lg font-bold">Welcome to the Cleaning Tracker</h1>
        <p>Track your cleaning tasks here</p>
        <p class="py-10 font-semibold">Sign up to get started</p>
        <div class="flex justify-start">
        <div id="g_id_onload" 
          data-client_id="${process.env.GOOGLE_CLIENT_ID}"
          data-login_uri="/auth/google"
          data-auto_prompt="false">
        </div>
        <div class="g_id_signin p-4" id="googlelogin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left">
        </div>
        <div class="p-4">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="login" hx-get="/login" hx-swap="outerHTML">Login with email</button>
        </div>
        </div>
        
      </div>
`
}
