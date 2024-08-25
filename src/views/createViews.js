import createViewWrapper from './viewWrapper.js'
import welcomePageView from './welcomePage.js'
import layout from './layout.js'
import loginView from './loginView.js'
import homePageView from './homePage.js'

const viewWrapper = createViewWrapper({ layout })

export default () => ({
  welcomePageView,
  homePageView,
  loginView,
  viewWrapper,
})
