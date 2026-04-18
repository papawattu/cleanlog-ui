const puppeteer = require('puppeteer');

describe('Cleanlog Routing', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  it('should navigate to login page', async () => {
    await page.goto('http://localhost:8080/');
    await page.click('a[href="#/login"]');
    const loginForm = await page.waitForSelector('login-form');
    expect(loginForm).toBeTruthy();
  });

  it('should navigate to register page', async () => {
    await page.goto('http://localhost:8080/');
    await page.click('a[href="#/register"]');
    const registerForm = await page.waitForSelector('registration-form');
    expect(registerForm).toBeTruthy();
  });
});
