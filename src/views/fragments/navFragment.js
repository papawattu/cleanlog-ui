export default ({ user = null }) => String.raw`
<nav hx-get="/nav" hx-trigger="navUpdate from:body" class="min-w-96">
<ul class="flex flex-grow">
  <li><a href="/">Home</a></li>
  <li>${
    !user
      ? '<a href="/login">Login</a>'
      : `<a href="/profile/${user}" id="profile">${user}</a></li><li><a href="/logout">Logout</a>`
  }</li>
</ul>
</nav>`
