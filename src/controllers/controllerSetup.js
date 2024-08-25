import CreateLoginController from './loginController.js'
import CreateHomepageController from './homePageController.js'
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
    { path: '/', router: CreateHomepageController({ viewWrapper }) },
  ]
}
