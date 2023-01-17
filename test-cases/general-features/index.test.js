import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import { rm, stat, readFile } from 'fs/promises'
import cheerio from 'cheerio'
import { allFiles } from 'async-folder-walker'

const __dirname = desm(import.meta.url)

tap.test('general-features', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const cwd = __dirname
  const siteUp = new Siteup(src, dest, cwd)

  await rm(dest, { recursive: true })

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

  const files = await allFiles(dest, { shaper: fwData => fwData })

  t.ok('All files walked in output')

  const generatedGlobalStyle = files.some(f => f.relname === 'global.css')
  t.equal(generatedGlobalStyle, globalAssets.globalStyle, `${globalAssets.globalStyle
            ? 'Generated'
            : 'Did not generate'} a global style`)

  const generatedGlobalClient = files.some(f => f.relname.match(/global.client-([A-Z])\w+.js/g))
  t.equal(generatedGlobalClient, globalAssets.globalClient, `${globalAssets.globalClient
            ? 'Generated'
            : 'Did not generate'} a global client`)

  for (const [filePath, assertions] of Object.entries(pages)) {
    try {
      const fullPath = path.join(dest, filePath)
      const fileDir = path.dirname(filePath)
      const st = await stat(fullPath)
      t.ok(st, `${filePath} exists`)

      const contents = await readFile(fullPath, 'utf8')
      const doc = cheerio.load(contents)

      const headScripts = Array.from(doc('head script[type="module"]'))

      const hasGlboalClientHeader = headScripts.map(n => n?.attribs?.src).some(src => src.match(/global.client-([A-Z])\w+.js/g))
      const hasPageClientHeader = headScripts.map(n => n?.attribs?.src).some(src => src.match(/\.\/client-([A-Z])\w+.js/g))
      const generatedPageClient = files.some(f => f.relname.match(/client-([A-Z])\w+.js/g))

      const headLinks = Array.from(doc('head link[rel="stylesheet"]'))
      const hasGlobalStyleHeader = headLinks.map(n => n?.attribs?.href).includes('/global.css')
      const hasPageStyleHeader = headLinks.map(n => n?.attribs?.href).includes('./style.css')
      const generatedPageStyle = files.some(f => f.relname === path.join(fileDir, 'style.css'))

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

      if (hasPageClientHeader) { // covering for loose files
        t.equal(
          generatedPageClient,
          assertions.client,
          `${filePath} ${assertions.client
            ? 'Generated'
            : 'Did not generate'} a page client file`)
      }

      t.equal(
        hasPageStyleHeader,
        assertions.style,
        `${filePath} ${assertions.client
            ? 'Includes'
            : 'Does not include'} a page style header`)

      if (hasPageStyleHeader) { // covering for loose files
        t.equal(
          generatedPageStyle,
          assertions.style,
          `${filePath} ${assertions.client
            ? 'Generated'
            : 'Did not generate'} a page style file`)
      }
    } catch (e) {
      console.error(e)
      t.fail(`Assertions failed on ${filePath}`)
    }
  }
})
