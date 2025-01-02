import { html, render } from 'lit-html'
import pbstore from '../../services/pbstore'
import workLogService from '../../services/workLog'
import auth from '../../auth/auth'

export default async function ({ createWorkLog }) {
  const dialog = ({ date }) => html`<dialog open class="modal-content">
    <form id="addDayForm">
      <label for="day">Day</label>
      <input
        type="date"
        name="day"
        id="day"
        value="${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}"
        required
      />
      <label for="amount">Amount</label>
      <input type="number" name="amount" id="amount" required />
      <button type="submit">Add</button>
    </form>
    <button id="close">Close</button>
  </dialog>`

  return {
    addDayModal: ({ date }) => {
      const root = document.querySelector('#modal')

      if (!document.querySelector('dialog')) {
        render(dialog({ date }), root)
        document.querySelector('#container').classList.toggle('blur')
        document.querySelector('#close').addEventListener('click', () => {
          const dialog = document.querySelector('dialog')
          document.querySelector('#container').classList.toggle('blur')

          dialog.close()
        })
        document
          .querySelector('#addDayForm')
          .addEventListener('submit', async (ev) => {
            ev.preventDefault()
            const form = ev.target
            const data = new FormData(form)
            const day = data.get('day')
            const amount = data.get('amount')

            await createWorkLog({ date: day, hours: amount }).then(() => {
              const dialog = document.querySelector('dialog')
              document.querySelector('#container').classList.toggle('blur')
              dialog.close()
              //displayCalendar(new Date(day), id)
            })
          })
      } else {
        document.querySelector('#container').classList.toggle('blur')
        const dialog = document.querySelector('dialog')
        dialog.show()
      }
    },
  }
}
