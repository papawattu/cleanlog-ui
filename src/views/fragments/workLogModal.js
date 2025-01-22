import { html, render } from 'lit-html'

const formatDate = (date) =>
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2)

export default async function ({ createWorkLog, deleteWorkLog }) {
  const addDayDialog = ({ date, maxDate = new Date() }) =>
    html`<dialog open class="modal-content" id="addDayDialog">
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
  const viewDayModalDialog = ({ date, amount = 0 }) =>
    html`<dialog open class="modal-content" id="viewDayDialog">
      <h2>Work details</h2>
      <p>
        Date ${date.toLocaleDateString({ month: 'long' })}
        <span>Amount of hours: ${amount}</span>
      </p>
      <button id="delete" class="default-button">Delete</button>
      <button id="close" class="default-button">Close</button>
    </dialog>`

  return {
    viewDayModal: ({ date, amount }) => {
      const root = document.querySelector('#modal')
      if (!document.querySelector('dialog')) {
        render(viewDayModalDialog({ date, amount }), root)
        document.querySelector('#container').classList.toggle('blur')
        document.querySelector('#close').addEventListener('click', () => {
          const dialog = document.querySelector('dialog')
          document.querySelector('#container').classList.toggle('blur')

          dialog.close()
          render('', root)
        })
        document
          .querySelector('#delete')
          .addEventListener('click', async () => {
            const dialog = document.querySelector('dialog')
            document.querySelector('#container').classList.toggle('blur')
            await deleteWorkLog({ date })
            dialog.close()
            render('', root)
          })
      } else {
        document.querySelector('#container').classList.toggle('blur')
        const dialog = document.querySelector('dialog')
        const day = document.querySelector('#day')
        //day.value = formatDate(date)

        dialog.show()
      }
    },
    addDayModal: ({ date }) => {
      const root = document.querySelector('#modal')
      if (!document.querySelector('dialog')) {
        render(addDayDialog({ date }), root)
        document.querySelector('#container').classList.toggle('blur')
        document.querySelector('#close').addEventListener('click', () => {
          const dialog = document.querySelector('dialog')
          document.querySelector('#container').classList.toggle('blur')

          dialog.close()
          render('', root)
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
              render('', root)
              //displayCalendar(new Date(day), id)
            })
          })
      } else {
        document.querySelector('#container').classList.toggle('blur')
        const dialog = document.querySelector('dialog')
        //const day = document.querySelector('#day')
        //day.value = formatDate(date)

        dialog.show()
      }
    },
  }
}
