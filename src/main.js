import PocketBase from 'pocketbase'
import { render } from 'lit-html'
import mainView from './views/mainView'
import { displayCalendar } from './views/fragments/calendar'
import AuthService from './auth/auth'
import PBStore from './services/pbstore'
import WorkLogService from './services/workLog'

document.addEventListener('DOMContentLoaded', async function () {
  const pb = new PocketBase()

  const store = PBStore({ entity: 'worklog', pb })

  const authService = AuthService({ pb })

  await authService.loginUser()

  const { id, avatar, name } = await authService.getUser()

  const workLogService = WorkLogService({
    store,
    user: id,
  })
  const currentDate = new Date()

  render(mainView({ avatar, name }), document.getElementById('root'))

  workLogService.registerChangeListener((e) => {
    displayCalendar({ currentDate, authService, workLogService })
  })

  displayCalendar({ currentDate, authService, workLogService })
})
