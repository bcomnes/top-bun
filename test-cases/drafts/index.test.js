import tap from 'tap'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm, stat, readFile } from 'fs/promises'
import * as cheerio from 'cheerio'
import { allFiles } from 'async-folder-walker'

const __dirname = import.meta.dirname

tap.test('drafts', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new DomStack(src, dest, { buildDrafts: true })

  await rm(dest, { recursive: true, force: true })

  const results = await siteUp.build()
  t.ok(results, 'Domstack built site and returned build results')

  const pages = {
    'index.html': {
      client: false,
      style: false,
      draft: false
    },
    'a-draft-html/index.html': {
      client: false,
      style: false,
      draft: true
    },
    'a-draft-js/index.html': {
      client: false,
      style: false,
      draft: true
    },
    'a-draft-md/index.html': {
      client: false,
      style: false,
      draft: true
    },
    'a-draft-md/loose.html': {
      client: false,
      style: false,
      draft: true
    },
  }

  const files = await allFiles(dest, { shaper: fwData => fwData })

  t.ok('All files walked in output')

  for (const [filePath, assertions] of Object.entries(pages)) {
    try {
      const fullPath = path.join(dest, filePath)
      const st = await stat(fullPath)
      t.ok(st, `${filePath} exists`)

      const contents = await readFile(fullPath, 'utf8')
      const doc = cheerio.load(contents)

      const headScripts = Array.from(doc('head script[type="module"]'))

      const hasPageClientHeader = headScripts.map(n => n?.attribs?.['src']).some(src => src && src.match(/\.\/client-([A-Z0-9])\w+.js/g))
      const generatedPageClient = files.some(f => f.relname.match(/client-([A-Z0-9])\w+.js/g))

      const headLinks = Array.from(doc('head link[rel="stylesheet"]'))
      const hasPageStyleHeader = headLinks.map(n => n?.attribs?.['href']).some(href => href && href.match(/\.\/style-([A-Z0-9])\w+.css/g))

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
    } catch (e) {
      console.error(e)
      t.fail(`Assertions failed on ${filePath}`)
    }
  }
})
