import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../index.js'
import * as path from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'
import { stat, readFile } from 'fs/promises'
import cheerio from 'cheerio'

const __dirname = desm(import.meta.url)
const rimrafP = promisify(rimraf)

tap.test('general-features', async (t) => {
  const src = path.join(__dirname, './general-features/src')
  const dest = path.join(__dirname, './general-features/public')
  const cwd = path.join(__dirname, './general-features')
  const siteUp = new Siteup(src, dest, cwd)

  await rimrafP(dest)

  const results = await siteUp.build()
  t.ok(results, 'Siteup built site and returned build results')

  const globalAssets = {
    globalStyle: true,
    globalClient: true
  }

  const pages = {
    'index.html': {
      client: true,
      style: true
    },
    'md-page/index.html': {
      client: true,
      style: true
    },
    'md-page/loose-md.html': {
      client: false,
      style: false
    },
    'md-page/md-no-style-client/index.html': {
      client: false,
      style: false
    },
    'js-page/index.html': {
      client: true,
      style: true
    },
    'js-page/loose-md.html': {
      client: false,
      style: false
    },
    'js-page/js-no-style-client/index.html': {
      client: false,
      style: false
    },
    'js-page/js-no-async-export/index.html': {
      client: false,
      style: false
    },
    'html-page/index.html': {
      client: true,
      style: true
    },
    'html-page/html-no-style-client/index.html': {
      client: false,
      style: false
    }
  }

  for (const [filePath, assertions] of Object.entries(pages)) {
    try {
      const fullPath = path.join(dest, filePath)
      const st = await stat(fullPath)
      t.ok(st, `${filePath} exists`)

      const contents = await readFile(fullPath, 'utf8')

      const doc = cheerio.load(contents)

      const headScripts = Array.from(doc('head script[type="module"]'))

      const hasGlboalClientHeader = headScripts.map(n => n?.attribs?.src).includes('/global.client.js')

      const hasPageClientHeader = headScripts.map(n => n?.attribs?.src).includes('./client.js')

      const headLinks = Array.from(doc('head link[rel="stylesheet"]'))

      const hasGlobalStyleHeader = headLinks.map(n => n?.attribs?.href).includes('/global.css')

      const hasPageStyleHeader = headLinks.map(n => n?.attribs?.href).includes('./style.css')

      t.equal(
        hasGlboalClientHeader,
        globalAssets.globalClient,
        `${filePath} ${globalAssets.globalClient
            ? 'includes'
            : 'does not include'} a global client header`)

      t.equal(
        hasGlobalStyleHeader,
        globalAssets.globalStyle,
        `${filePath} ${globalAssets.globalStyle
            ? 'Includes'
            : 'Does not include'} a global style header`)

      t.equal(
        hasPageClientHeader,
        assertions.client,
        `${filePath} ${assertions.client
            ? 'Includes'
            : 'Does not include'} a page client header`)

      t.equal(
        hasPageStyleHeader,
        assertions.style,
        `${filePath} ${assertions.client
            ? 'Includes'
            : 'Does not include'} a page client header`)

    } catch (e) {
      console.error(e)
      t.fail(`Assertions failed on ${filePath}`)
    }
  }
})
