import { html } from 'lit-html'
import { createCalendar } from '../../utils/calendar'
import workLogService from '../../services/workLog'
import pbstore from '../../services/pbstore'
import auth from '../../auth/auth'
import workLogModal from './workLogModal'

export async function calendar(pb) {
  const calendar = document.querySelector('#calendar > tbody')
  calendar.innerHTML = ''
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const selectedDates = await pb
    .collection('worklog')
    .getFullList()
    .then((data) => {
      return data.map((item) => new Date(item.date).getDate())
    })
  calendar.innerHTML = createCalendar(year, month, selectedDates)
}

export async function displayCalendar({ currentDate = new Date(), id, pb }) {
  const user = auth({ pb }).getUser()
  const store = pbstore({ entity: 'worklog', pb })

  document.querySelector('#month').innerHTML = currentDate.toLocaleString(
    'default',
    { month: 'long' }
  )
  document.querySelector('#year').innerHTML = currentDate.getFullYear()
  await calendar(pb)

  for (let i = 1; i < 32; i++) {
    document
      .getElementById(`day-${i}`)
      .addEventListener('click', async (ev) => {
        const { addDayModal } = await workLogModal({ pb })
        const date = new Date(currentDate)
        date.setDate(i)
        addDayModal({ date, id, pb })
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
