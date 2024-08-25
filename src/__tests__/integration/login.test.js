import puppeteer from 'puppeteer'
import getPort from 'get-port'
import App from '../../app.js'

describe('Main App', () => {
  let browser
  let page
  let app
  let port

  const testUser = 'user'
  const testPassword = 'password'

  beforeAll(async () => {
    port = await getPort()
    app = new App({ port })
    app.init()
    browser = await puppeteer.launch({
      headless: true,
      //  slowMo: 80,
    })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    app.stop()
  })

  it('Should launch login form', async () => {
    await page.goto(`http://localhost:${port}/login`)

    await page.waitForSelector('form')
  })
})
