import CreateLoginController from './loginController.js'
import CreateHomepageController from './homePageController.js'
import CreateNavController from './navController.js'
import TaskController from './taskController.js'
import createViews from '../views/createViews.js'

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
    { path: '/tasks/*', router: TaskController({ viewWrapper }) },
    { path: '/nav', router: CreateNavController({ viewWrapper }) },
    { path: '/', router: CreateHomepageController({ viewWrapper }) },
  ]
}
