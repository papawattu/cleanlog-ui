import { html } from 'lit-html'
import logo from './fragments/logo'
import profile from './fragments/profile'
import { calendarFragment } from './fragments/calendar'

export default ({ avatar, name }) => html`<div
  id="container"
  class="container box"
>
  <header class="header">
    <div class="logo">
      ${logo()}
      <h1>Cleaning Diary</h1>
    </div>
    <nav class="nav">
      <div id="profile">${profile(avatar)}</div>
    </nav>
  </header>
  <div class="content">
    <main class="main">
      <h2>Welcome <span id="firstname">${name}</span></h2>
      <p>
        Cleaning Diary is a web application designed to help users log and track
        their cleaning activities. The application provides a monthly calendar
        view where users can add, view, and manage their cleaning logs.
      </p>
      <div class="tasks"></div>
      <!-- end of main -->
      <div class="amount">
        <svg
          width="80px"
          ,
          height="80px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" />
          <path
            class="pound"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 8.87498C12 8.5447 12.1198 8.35815 12.2652 8.23697C12.4335 8.09666 12.6963 8 13 8C13.3037 8 13.5665 8.09667 13.7348 8.23697C13.8802 8.35816 14 8.54471 14 8.87498C14 9.42727 14.4477 9.87498 15 9.87498C15.5523 9.87498 16 9.42727 16 8.87498C16 7.95527 15.6198 7.20433 15.0152 6.70052C14.4335 6.21584 13.6963 6 13 6C12.3037 6 11.5665 6.21583 10.9848 6.70052C10.3802 7.20433 10 7.95527 10 8.87498V11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H10V14.9631C9.9342 15.1063 9.80639 15.2264 9.69332 15.3316C9.41492 15.5906 9.04404 15.8367 8.73548 16.0087C8.24532 16.2819 8.12784 16.8106 8.22218 17.1924C8.31733 17.5775 8.67648 18 9.25168 18H15C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16H11.7124C11.8668 15.7336 12 15.3928 12 15V13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H12V8.87498ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
          />
        </svg>
        <h3 id="amount">0</h3>
      </div>
    </main>
    <!-- end of content -->
    ${calendarFragment()}
  </div>
  <div class="footer">Footer</div>
</div>`
