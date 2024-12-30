import PocketBase from 'pocketbase'
import { render } from 'lit-html'
import mainView from './views/mainView'
import { displayCalendar } from './views/fragments/calendar'
import auth from './auth/auth'

const pb = new PocketBase('http://localhost:8090/')

document.addEventListener('DOMContentLoaded', async function () {
  //console.log('loaded')
  const { getUser } = auth({ pb })

  const user = await getUser()
  console.log(JSON.stringify(user))
  render(mainView(user, pb), document.getElementById('root'))
  const currentDate = new Date()

  await pb.collection('worklog').subscribe(
    '*',
    function (e) {
      console.log('event', e)
      displayCalendar({ currentDate, id: user.id, pb })
    },
    {
      /* other options like expand, custom headers, etc. */
    }
  )
  displayCalendar({ currentDate, id: user.id, pb })
})
