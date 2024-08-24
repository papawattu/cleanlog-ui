import puppeteer from 'puppeteer'
import getPort from 'get-port'
import App from '../../app.js'

describe('Main App', () => {
  let browser
  let page
  let app
  let port

  beforeAll(async () => {
    port = await getPort()
    app = new App({ port })
    app.init()
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 80,
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
    const text = await page.evaluate(() => document.head.title)
    expect(text).toBe('Home Page')
  })
})
