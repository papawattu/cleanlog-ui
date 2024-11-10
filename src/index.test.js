const puppeteer = require('puppeteer')

describe('CleanLog UI Tests', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 80,
      args: ['--start-maximized'],
    })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('should load the homepage', async () => {
    await page.goto('http://localhost:3000')
    const title = await page.title()
    expect(title).toBe('CleanLog')
  })

  // Add more tests here
})
