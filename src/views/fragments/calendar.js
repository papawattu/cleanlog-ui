import { html } from 'lit-html'
import { createCalendar } from '../../utils/calendar'
import workLogModal from './workLogModal'

export async function calendar({ getWorkLogs, id }) {
  const calendar = document.querySelector('#calendar > tbody')
  calendar.innerHTML = ''
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const selectedDates = await getWorkLogs(`user = "${id}"`).then((data) => {
    return data.map((item) => new Date(item.date).getDate())
  })
  calendar.innerHTML = createCalendar(year, month, selectedDates)
}

export async function displayCalendar({
  currentDate = new Date(),
  authService,
  workLogService: { createWorkLog, getWorkLogs },
}) {
  document.querySelector('#month').innerHTML = currentDate.toLocaleString(
    'default',
    { month: 'long' }
  )
  document.querySelector('#year').innerHTML = currentDate.getFullYear()
  await calendar({ getWorkLogs, id: (await authService.getUser()).id })

  for (let i = 1; i < 32; i++) {
    document
      .getElementById(`day-${i}`)
      .addEventListener('click', async (ev) => {
        const { addDayModal } = await workLogModal({ createWorkLog })
        const date = new Date(currentDate)
        date.setDate(i)
        addDayModal({ date, authService, pb })
      })
  }
}

export const calendarFragment = () => html`<div class="calendar-header">
  <table id="calendar">
    <caption>
      <span id="month">Month</span>
      <span id="year">Year</span>
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
