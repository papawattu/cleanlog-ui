const loginButton = String.raw`<a href="/login" class="">Login</a>`
const logoutButton = String.raw`<a href="/logout" id="logout" class="">Logout</a>`

export default ({ user = null }) => String.raw`
<nav hx-get="/nav" hx-trigger="navUpdate from:body" class="">
  <div class="flex justify-between">
    <h1 class="font-extrabold text-3xl p-4 text-black">Cleaning Tracker</h1>
    <ul class="flex justify-end items-center">
      <li class="list-none inline-block px-4 font-semibold" ><a href="/" class="">Home</a></li>
      <li class="list-none inline-block px-4 font-semibold" ><a href="/tasks" class="">Tasks</a></li>
      <li class="list-none inline-block px-4 font-semibold" ><a href="/about" class="">About</a></li>
      <li class="list-none inline-block px-4 font-semibold" >${
        !user ? '' : logoutButton
      }</li>
      <li class="list-none inline-block px-4 font-semibold" ><a href="/profile/${
        user?.sub || 'no-user'
      }" class=""><img src="${
  user?.picture || '/img/no-user.png'
}" class="w-10 h-10 rounded-full" alt="user picture" /></a></li>
      
    </ul>
  </div>
</nav>`
