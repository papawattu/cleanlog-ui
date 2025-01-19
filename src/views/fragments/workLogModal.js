import { html, render } from 'lit-html'

const formatDate = (date) =>
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2)

export default async function ({ createWorkLog }) {
  const dialog = ({ date, maxDate = new Date() }) =>
    html`<dialog open class="modal-content">
      <form id="addDayForm">
        <label for="day">Day</label>
        <input
          type="date"
          name="day"
          id="day"
          value="${formatDate(date)}"
          max="${formatDate(maxDate)}"
          placeholder="enter date"
          required
        />
        <label for="amount">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value=""
          placeholder="enter amount"
          required
        />
        <button type="submit" class="default-button">Add</button>
      </form>
      <button id="close" class="default-button">Close</button>
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
