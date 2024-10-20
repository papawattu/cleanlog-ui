import CreateLoginController from './loginController.js'
import CreateHomepageController from './homePageController.js'
import CreateNavController from './navController.js'
import LogoutController from './logoutController.js'
import TaskController from './taskController.js'
import createViews from '../views/createViews.js'
import CreateWorkLogController from './workLogController.js'

export default function ControllerSetup({ loginAuthService }) {
  const { welcomePageView, layout, viewWrapper } = createViews()
  return [
    {
      path: '/login',
      router: CreateLoginController({
        viewWrapper,
        authenticate: loginAuthService,
        sucessfulView: welcomePageView,

      }),
    },
    {
      path: '/auth/google',
      router: CreateLoginController({
        viewWrapper,
        authenticate: loginAuthService,
        sucessfulView: welcomePageView,
      }),
    },
    { path: '/worklog/*', router: CreateWorkLogController({ viewWrapper })},
    { path: '/tasks/*', router: TaskController({ viewWrapper }) },
    { path: '/nav', router: CreateNavController({ viewWrapper }) },
    { path: '/logout', router: LogoutController({ viewWrapper }) },
    { path: '/', router: CreateHomepageController({ viewWrapper }) },
  ]
}
