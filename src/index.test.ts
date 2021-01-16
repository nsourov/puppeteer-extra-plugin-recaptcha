import test from 'ava'

import RecaptchaPlugin from './index'
// import * as types from './types'

// import { Puppeteer } from './puppeteer-mods'

import { addExtra } from 'puppeteer-extra'

const PUPPETEER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox']

test('will detect captchas', async (t) => {
  // const puppeteer = require('puppeteer-extra')
  const puppeteer = addExtra(require('puppeteer'))
  const recaptchaPlugin = RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: process.env.TOKEN,
    },
    visualFeedback: true,
    proxy: process.env.PROXY,
  })
  puppeteer.use(recaptchaPlugin)

  const browser = await puppeteer.launch({
    args: PUPPETEER_ARGS,
    headless: true,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })
  const page = await browser.newPage()

  const url = 'https://www.google.com/recaptcha/api2/demo'
  await page.goto(url, { waitUntil: 'networkidle0' })

  // @ts-ignore: Unreachable code error
  const { captchas, solved } = await page.solveRecaptchas()
  t.is(captchas.length, 1)

  const c = captchas[0]
  t.is(c.callback, 'onSuccess')
  t.is(c.hasResponseElement, true)
  t.is(c.responseElementContent, '')
  t.is(c.url, url)
  t.true(c.sitekey && c.sitekey.length > 5)

  await browser.close()
})

// TODO: test/mock the rest
