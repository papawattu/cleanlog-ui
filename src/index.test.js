import puppeteer from 'puppeteer'

describe('CleanLog UI Tests', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
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
    expect(el).toBeTruthy()
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
    await page.waitForSelector('section#task-list')

    const id = await page.evaluate(() =>
      document.querySelector('section#task-list')
    )

    expect(id).toBeTruthy()
    // expect(text).toBeTruthy()
  })
  test('should add task', async () => {
    await page.waitForSelector('a#addtask')

    await page.click('a#addtask')
    await page.waitForSelector('form')
    await page.waitForSelector('input[name="taskName"]')

    await page.type('input[name="taskName"]', 'Test123')

    await page.type('input[name="description"]', 'Test123')

    await page.click('button[type="submit"]')

    await page.waitForSelector('section#task-list')

    await page.waitForSelector('#task-list > ul > li > a')

    const text = await page.evaluate(
      () => document.querySelector('#task-list > ul > li > a').innerText
    )
    expect(text).toBe('Test123')
  })
  test('should delete task', async () => {
    await page.waitForSelector('a#delete')

    await page.click('a#delete')

    await page.waitForSelector('#task-list > p')

    const text = await page.evaluate(
      () => document.querySelector('#task-list > p').innerText
    )

    expect(text).toBe('No tasks found')
  })
})
