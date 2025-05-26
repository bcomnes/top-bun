import { test } from 'node:test'
import assert from 'node:assert'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm, stat, readFile } from 'fs/promises'
import * as cheerio from 'cheerio'
import { allFiles } from 'async-folder-walker'

const __dirname = import.meta.dirname

test('general-features', async () => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new DomStack(src, dest, { copy: [path.join(__dirname, './copyfolder')] })

  await rm(dest, { recursive: true, force: true })

  const results = await siteUp.build()
  assert.ok(results, 'DomStack built site and returned build results')

  const globalAssets = {
    globalStyle: true,
    globalClient: true,
  }

  const pages = {
    'index.html': {
      client: true,
      style: true,
    },
    'md-page/index.html': {
      client: true,
      style: true,
    },
    'md-page/loose-md.html': {
      client: false,
      style: false,
    },
    'md-page/md-no-style-client/index.html': {
      client: false,
      style: false,
    },
    'js-page/index.html': {
      client: true,
      style: true,
    },
    'js-page/loose-md.html': {
      client: false,
      style: false,
    },
    'js-page/js-no-style-client/index.html': {
      client: false,
      style: false,
    },
    'js-page/js-no-async-export/index.html': {
      client: false,
      style: false,
    },
    'html-page/index.html': {
      client: true,
      style: true,
    },
    'html-page/html-no-style-client/index.html': {
      client: false,
      style: false,
    },
  }

  const files = await allFiles(dest, { shaper: fwData => fwData })

  assert.ok('All files walked in output')

  const generatedGlobalStyle = files.some(f => f.relname.match(/global-([A-Z0-9])\w+.css/g))
  assert.equal(generatedGlobalStyle, globalAssets.globalStyle, `${globalAssets.globalStyle
            ? 'Generated'
            : 'Did not generate'} a global style`)

  const generatedGlobalClient = files.some(f => f.relname.match(/global.client-([A-Z0-9])\w+.js/g))
  assert.equal(generatedGlobalClient, globalAssets.globalClient, `${globalAssets.globalClient
            ? 'Generated'
            : 'Did not generate'} a global client`)

  for (const [filePath, assertions] of Object.entries(pages)) {
    try {
      const fullPath = path.join(dest, filePath)
      const st = await stat(fullPath)
      assert.ok(st, `${filePath} exists`)

      const contents = await readFile(fullPath, 'utf8')
      const doc = cheerio.load(contents)

      const headScripts = Array.from(doc('head script[type="module"]'))

      const hasGlboalClientHeader = headScripts.map(n => n?.attribs?.['src'])?.some(src => src && src.match(/global.client-([A-Z0-9])\w+.js/g))
      const hasPageClientHeader = headScripts.map(n => n?.attribs?.['src']).some(src => src && src.match(/\.\/client-([A-Z0-9])\w+.js/g))
      const generatedPageClient = files.some(f => f.relname.match(/client-([A-Z0-9])\w+.js/g))

      const headLinks = Array.from(doc('head link[rel="stylesheet"]'))
      const hasGlobalStyleHeader = headLinks.map(n => n?.attribs?.['href']).some(href => href && href.match(/global-([A-Z0-9])\w+.css/g))
      const hasPageStyleHeader = headLinks.map(n => n?.attribs?.['href']).some(href => href && href.match(/\.\/style-([A-Z0-9])\w+.css/g))
      const generatedPageStyle = files.some(f => f.relname.match(/style-([A-Z0-9])\w+.css/g))

      const wroteDomstackEsbuildMetaFile = files.find(f => f.relname.match(/dom-stack-esbuild-meta.json/g))

      assert.equal(
        hasGlboalClientHeader,
        globalAssets.globalClient,
        `${filePath} ${globalAssets.globalClient
            ? 'includes'
            : 'does not include'} a global client header`)

      assert.equal(
        hasGlobalStyleHeader,
        globalAssets.globalStyle,
        `${filePath} ${globalAssets.globalStyle
            ? 'Includes'
            : 'Does not include'} a global style header`)

      assert.equal(
        hasPageClientHeader,
        assertions.client,
        `${filePath} ${assertions.client
            ? 'Includes'
            : 'Does not include'} a page client header`)

      if (hasPageClientHeader) { // covering for loose files
        assert.equal(
          generatedPageClient,
          assertions.client,
          `${filePath} ${assertions.client
            ? 'Generated'
            : 'Did not generate'} a page client file`)
      }

      assert.equal(
        hasPageStyleHeader,
        assertions.style,
        `${filePath} ${assertions.client
            ? 'Includes'
            : 'Does not include'} a page style header`)

      assert.ok(
        wroteDomstackEsbuildMetaFile,
        'wrote out the dom-stack-esbuild-meta.json file'
      )

      if (hasPageStyleHeader) { // covering for loose files
        assert.equal(
          generatedPageStyle,
          assertions.style,
          `${filePath} ${assertions.client
            ? 'Generated'
            : 'Did not generate'} a page style file`)
      }
    } catch (e) {
      console.error(e)
      assert.fail(`Assertions failed on ${filePath}`)
    }
  }

  const expected = [
    'client.js',
    'hello.html',
    'styles/globals.css'
  ]

  for (const rel of expected) {
    const full = path.join(dest, 'oldsite', rel)
    const st = await stat(full)
    assert.ok(st.isFile(), `oldsite/${rel} exists and is a file`)
  }
})
