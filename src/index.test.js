import puppeteer from 'puppeteer'

describe('CleanLog UI Tests', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      //slowMo: 200,
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

  test('should display have link to work logs', async () => {
    await page.waitForSelector('a#worklog')
    const text = await page.evaluate(
      () => document.querySelector('a#worklog').innerText
    )
    expect(text).toBe('Work Log')
  })
  test('should go to work log page', async () => {
    await page.click('a#worklog')

    const title = await page.title()

    expect(title).toBe('Work View')
  })

  test('should display work log table', async () => {
    await page.waitForSelector('table#worklist')
    const el = await page.evaluate(
      () => document.querySelector('table#worklist').innerHTML
    )
    console.log(el)
    //expect(text).toBe('Work Log')
  })
  test('should display add worklog', async () => {
    await page.waitForSelector('a#addworklog')
    await page.click('a#addworklog')
    await page.waitForSelector('form')
    await page.waitForSelector('input#description')
    const description = await page.evaluate(
      () => document.querySelector('input[name="description"]').value
    )
    expect(description).toBe('')
  })
  test('should add worklog', async () => {
    await page.type('input[name="description"]', 'Test123')
    await page.type('input[name="date"]', '10/11/2021')

    await page.click('input[type="submit"]')
    await page.waitForSelector('table#worklist')

    const text = await page.evaluate(() =>
      Array.from(document.querySelectorAll('td a')).find(
        (el) => el.innerText === 'Test123'
      )
    )

    expect(text).toBeTruthy()
  })
  test('should select worklog', async () => {
    const text = await page.evaluate(() =>
      Array.from(document.querySelectorAll('td a')).find(
        (el) => el.innerText === 'Test123'
      )
    )

    expect(text).toBeTruthy()
  })
})
