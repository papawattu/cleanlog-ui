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

  it('Should launch page and connect', async () => {
    await page.goto(`http://localhost:${port}`)
  })
  it('Should launch home page', async () => {
    await page.goto(`http://localhost:${port}`)
    const text = await page.evaluate(() => document.title)
    expect(text).toBe('Home Page')
  })
  it('Should have login button on home page', async () => {
    await page.goto(`http://localhost:${port}`)
    const loginButton = await page.$('button')
    const text = await page.evaluate(
      (button) => button.textContent,
      loginButton
    )
    expect(text).toBe('Login')
  })
  it('Should login and welcome user', async () => {
    await page.goto(`http://localhost:${port}`)
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
    const text = await page.evaluate(
      () => document.querySelector('h3').textContent
    )
    expect(text).toBe(`Welcome back ${testUser}`)
  })
  it('Should display logged in user in header', async () => {
    await page.waitForSelector('nav', { waitUntil: 'networkidle0' })

    const text = await page.evaluate(
      () => document.querySelector('a#profile').textContent
    )
    expect(text).toBe(testUser)
  })
  it('Should fail login with invalid user', async () => {
    const page = await browser.newPage()
    await page.goto(`http://localhost:${port}`)
    const loginButton = await page.$('button')
    await loginButton.click()
    await page.waitForSelector('form#loginform')
    await page.waitForSelector('input[name="username"]')
    await page.waitForSelector('input[name="password"]')
    await page.waitForSelector('button[type="submit"]')
    await page.type('input[name="username"]', 'invalid')
    await page.type('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForSelector('p#message')
    const text = await page.evaluate(
      () => document.querySelector('p#message').textContent
    )
    expect(text).toBe(`Invalid username or password`)
  })
  it('Should fail login with invalid password', async () => {
    const page = await browser.newPage()
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' })

    const loginButton = await page.$('button')
    await loginButton.click()
    await page.waitForSelector('form')
    await page.waitForSelector('input[name="username"]')
    await page.waitForSelector('input[name="password"]')
    await page.waitForSelector('button[type="submit"]')
    await page.type('input[name="username"]', testUser)
    await page.type('input[name="password"]', 'invalid')
    await page.click('button[type="submit"]', {
      waitUntil: 'networkidle0',
    })
    await page.waitForSelector('p#message')
    const text = await page.evaluate(
      () => document.querySelector('p#message').textContent
    )
    expect(text).toBe(`Invalid username or password`)
  })
})
