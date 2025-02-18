import PocketBase from 'pocketbase'
import { monthlyCalendarFragment } from './views/fragments/calendar'
import AuthService from './auth/auth'
import PBStore from './services/pbstore'
import WorkLogService from './services/workLog'
import { createState } from './utils/state'
import { RenderRoot } from './views/renderRoot'

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

  const state = createState({ initialProps: { avatar, name } })

  state.setProps({ currentDate: new Date() })

  RenderRoot({ props: state.getProps() })

  const { render, nextPrevListener } = await monthlyCalendarFragment({
    state,
    authService,
    workLogService,
  })
  workLogService.registerChangeListener((e) => {
    render()
  })

  render()
  nextPrevListener()
})
