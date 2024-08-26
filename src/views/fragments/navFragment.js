export default ({ user = null }) => String.raw`
<nav hx-get="/nav" hx-trigger="navUpdate from:body" class="bg-white border-gray-200">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <h1 class="font-bold text-4xl">Cleaning Tracker</h1>
    <div class="flex items-center space-x-4">
      <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
        <li><a href="/" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0">Home</a></li>
        <li>${
          !user
            ? '<a href="/login" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0">Login</a>'
            : `<li><a href="/logout" id="logout" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0">Logout</a>`
        }</li>
      </ul>
    </div>
  </div>
</nav>`
