import { html } from 'lit-html'
import workLogModal from './workLogModal'

const createCalendar = (year, month, selectedDates, maxDate = new Date()) => {
  let mon = month - 1 // months in JS are 0..11, not 1..12
  let d = new Date(year, mon)

  let table = ''

  // spaces for the first row
  // from Monday till the first day of the month
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += '<td class="blank"></td>'
  }

  // <td> with actual dates
  while (d.getMonth() == mon) {
    let classNames = selectedDates.includes(d.getDate()) ? 'selected' : ''
    classNames += d > maxDate ? ' disabled' : ''
    classNames += d.toDateString() === new Date().toDateString() ? ' today' : ''
    table += `<td ${
      classNames ? 'class="' + classNames + '"' : ''
    } id="day-${d.getDate()}">${d.getDate()}</td>`

    if (getDay(d) % 7 == 6) {
      // sunday, last day of week - newline
      table += '</tr><tr>'
    }

    d.setDate(d.getDate() + 1)
  }

  // add spaces after last days of month for the last row
  // 29 30 31 * * * *
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += '<td class="blank"></td>'
    }
  }

  return table
}

const getDay = (date) => {
  // get day number from 0 (monday) to 6 (sunday)
  let day = date.getDay()
  if (day == 0) day = 7 // make Sunday (0) the last day
  return day - 1
}

export async function calendar({ getWorkLogs, id, date }) {
  document.querySelector('#month').innerHTML = date.toLocaleString('default', {
    month: 'long',
  })
  document.querySelector('#year').innerHTML = date.getFullYear()

  const calendar = document.querySelector('#calendar > tbody')
  calendar.innerHTML = ''
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const selectedDates = await getWorkLogs(`user = "${id}"`).then((data) => {
    return data
      .filter((item) => new Date(item.date).getMonth() === date.getMonth())
      .map((item) => new Date(item.date).getDate())
  })
  calendar.innerHTML = createCalendar(year, month, selectedDates)
}

function addClickListeners({ date, authService, createWorkLog }) {
  for (let i = 1; i < 32; i++) {
    document
      .getElementById(`day-${i}`)
      .addEventListener('click', async (ev) => {
        const { addDayModal } = await workLogModal({ createWorkLog })

        date.setDate(i)
        if (date > new Date()) return
        addDayModal({ date, authService })
      })
  }
}
export async function renderMonthlyCalendarFragment({
  authService,
  state,
  workLogService: { createWorkLog, getWorkLogs },
}) {
  const { currentDate } = state.getProps()

  await calendar({
    date: currentDate,
    getWorkLogs,
    id: (await authService.getUser()).id,
  })

  addClickListeners({ date: currentDate, authService, createWorkLog })

  document.getElementById('prev').addEventListener('click', async () => {
    currentDate.setMonth(currentDate.getMonth() - 1)
    state.setProps({ currentDate })
    await calendar({
      date: currentDate,
      getWorkLogs,
      id: (await authService.getUser()).id,
    })
    addClickListeners({ date: currentDate, authService, createWorkLog })
  })
  document.getElementById('next').addEventListener('click', async () => {
    currentDate.setMonth(currentDate.getMonth() + 1)
    state.setProps({ currentDate })
    await calendar({
      date: currentDate,
      getWorkLogs,
      id: (await authService.getUser()).id,
    })
    addClickListeners({ date: currentDate, authService, createWorkLog })
  })
}

const arrow = () => html`<svg
  width="1.75rem"
  height="1.75rem"
  viewBox="0 0 512 512"
  version="1.1"
>
  <g id="Layer_1" />
  <g id="Layer_2">
    <g>
      <path
        class="st0"
        d="M256,43.5C138.64,43.5,43.5,138.64,43.5,256S138.64,468.5,256,468.5S468.5,373.36,468.5,256    S373.36,43.5,256,43.5z M324.14,358.2c6.26,6.24,6.27,16.37,0.03,22.63c-3.13,3.13-7.23,4.7-11.33,4.7    c-4.09,0-8.17-1.56-11.3-4.67L187.86,267.5c-3.01-3-4.7-7.07-4.7-11.32s1.68-8.32,4.69-11.33l113.69-113.69    c6.25-6.25,16.38-6.25,22.63,0c6.25,6.25,6.25,16.38,0,22.63L221.8,256.15L324.14,358.2z"
      />
    </g>
  </g>
</svg>`
export const calendarFragment = () => html`<div class="calendar-header">
  <table id="calendar">
    <caption>
      <div class="calendar-nav">
        <button id="prev" class="back-button">${arrow()}</button>
        <div class="calendar-title">
          <span id="month">Month</span>
          <span id="year">Year</span>
        </div>
        <button id="next" class="next-button">${arrow()}</button>
      </div>
    </caption>
    <thead>
      <tr>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
        <th>Sun</th>
      </tr>
    </thead>
    <tbody>
      <tr></tr>
    </tbody>
  </table>
  <!-- <button @click=${() =>
    addDayModal({ date: new Date(), id, pb })}>Add</button> -->
</div>`
