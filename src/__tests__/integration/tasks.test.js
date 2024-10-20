import puppeteer from 'puppeteer'
import getPort from 'get-port'
import App from '../../app.js'

describe('Tasks', () => {
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
      slowMo: 10,
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
  it('Should have no tasks', async () => {
    page.waitForSelector('h2', { waitUntil: 'networkidle0' })
    page.waitForSelector('p#notasks', { waitUntil: 'networkidle0' })
    const text = await page.evaluate(
      () => document.querySelector('#notasks').textContent
    )
    expect(text).toBe(`${testUser} you have no tasks`)
  })
  it('Should have no worked logged', async () => {
    const text = await page.evaluate(
      () => document.querySelector('#noworklogged').textContent
    )
    expect(text).toBe(`${testUser} you have no work logged`)
  })
  it('Should have add task button', async () => {
    const text = await page.evaluate(
      () => document.querySelector('button#addtask').textContent
    )
    expect(text).toBe(`Add Task`)
  })
  it('Should have add log work button', async () => {
    const text = await page.evaluate(
      () => document.querySelector('button#logwork').textContent
    )
    expect(text).toBe(`Log Work`)
  })
  it('Should get add task form when button clicked', async () => {
    const addTaskButton = await page.$('button#addtask')
    await addTaskButton.click()
    await page.waitForSelector('form#taskform')
  })
  it('Should add task', async () => {
    await page.waitForSelector('form#taskform')
    await page.waitForSelector('input[name="taskname"]')
    await page.waitForSelector('textarea[name="taskdescription"]')
    await page.waitForSelector('button[type="submit"]')
    await page.type('input[name="taskname"]', 'Task 1')
    await page.type('textarea[name="taskdescription"]', 'Description 1')
    await page.click('button[type="submit"]', { waitUntil: 'networkidle0' })
    await page.waitForSelector('h2#message')

    const tasks = await page.evaluate(
      () => document.querySelectorAll('#tasks li').length
    )

    expect(tasks).toBe(1) // 1 task
  })
  it('Should second task', async () => {
    await page.waitForSelector('button#addtask')
    await page.click('button#addtask')
    await page.waitForSelector('form#taskform')
    await page.waitForSelector('input[name="taskname"]')
    await page.waitForSelector('textarea[name="taskdescription"]')
    await page.waitForSelector('button[type="submit"]')
    await page.type('input[name="taskname"]', 'Task 2')
    await page.type('textarea[name="taskdescription"]', 'Description 2')
    await page.click('button[type="submit"]', { waitUntil: 'networkidle0' })
    await page.waitForSelector('h2#message')

    const tasks = await page.evaluate(
      () => document.querySelectorAll('#tasks li').length
    )

    expect(tasks).toBe(2) // 2 tasks
  })
  it('Should delete task', async () => {
    await page.waitForSelector('button#deletetask')
    await page.click('button#deletetask', { waitUntil: 'networkidle0' })
    await page.waitForSelector('h2#message')

    const text = await page.evaluate(
      () => document.querySelector('h2#message').textContent
    )

    expect(text).toBe(`Task Deleted`)
    const tasks = await page.evaluate(
      () => document.querySelectorAll('#tasks li').length
    )
    expect(tasks).toBe(1) // 1 task
  })
})
