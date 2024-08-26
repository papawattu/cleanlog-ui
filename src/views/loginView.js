import { titleHelper } from '../helpers/helpers.js'
export default ({
  title = 'Login',
  user = null,
  message = '',
} = {}) => String.raw`${titleHelper(
  title
)}<div id="main" class="flex justify-center items-center">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 class="text-center text-xl font-bold mb-6">Please Login</h3>
                <form id="loginform" hx-post="/login" hx-target="#main">
                        <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                        Username
                                </label>
                                <input name="username" type="text" placeholder="Username" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-6">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                        Password
                                </label>
                                <input name="password" type="password" placeholder="Password" autocomplete required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="flex items-center justify-between">
                                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Login
                                </button>
                                ${
                                  message
                                    ? `<p id="message" class="text-red-500">${message}</p>`
                                    : ''
                                }
                        </div>
                </form>
        </div>
</div>`
