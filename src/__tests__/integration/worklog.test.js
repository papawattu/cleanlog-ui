import puppeteer from 'puppeteer'
import getPort from 'get-port'
import App from '../../app.js'

describe('Work Log', () => {
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
      slowMo: 0,
    })
    page = await browser.newPage()
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' })
    const loginButton = await page.$('button')
    await loginButton.click()
    await page.waitForSelector('form')
    await page.waitForSelector('input[name="username"]')
    await page.waitForSelector('input[name="password"]')
    await page.waitForSelector('button[type="submit"]')
    await page.type('input[name="username"]', testUser)
    await page.type('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForSelector('h3')
  })

  afterAll(async () => {
    await browser.close()
    app.stop()
  })

  it('Should be logged in', async () => {
    const text = await page.evaluate(
      () => document.querySelector('h3').textContent
    )
    expect(text).toBe(`Welcome back ${testUser}`)
  })
  it('Should have no worked logged', async () => {
    const text = await page.evaluate(
      () => document.querySelector('#noworklogged').textContent
    )
    expect(text).toBe(`${testUser} you have no work logged`)
  })
  it('Should have add log work button', async () => {
    const text = await page.evaluate(
      () => document.querySelector('button#logwork').textContent
    )
    expect(text).toBe(`Log Work`)
  })
  
})
