import { titleHelper } from '../helpers/helpers.js'

export default ({ title = 'Home Page', user = null } = {}) => {
  return String.raw`${titleHelper(title)}
    <main class="min-h-screen">
      <div class="flex flex-auto justify-evenly">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="login" hx-get="/login" hx-swap="outerHTML">Login</button>
      </div>
    </main>`
}
