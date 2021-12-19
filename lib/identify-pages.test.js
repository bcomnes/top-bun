import test from 'brittle'
import desm from 'desm'
import { resolve } from 'path'

import { identifyPages } from './identify-pages.js'
import { pageBuilders } from './build-pages/index.js'

const __dirname = desm(import.meta.url)

test('identifyPages works as expected', async (t) => {
  const results = await identifyPages(resolve(__dirname, '../tests/test-cases/general-features/src'), pageBuilders)
  // console.log(results)
  t.ok(results.globalStyle, 'Global style is found')
  t.ok(results.globalVars, 'Global variabls are found')
  t.ok(results.rootLayout, 'Root layout file is found')
  t.is(Object.keys(results.pages).length, 11, '11 pages are found')

  t.is(results.warnings.length, 0, '0 warnings produced')
  t.is(results.nonPageFolders.length, 1, '1 non-page-folder')
  t.is(results.pages.find(p => p.path === 'html-page').page.type, 'html', 'html page is type html')
  t.is(results.pages.find(p => p.path === 'md-page').page.type, 'md', 'md page is type md')
  t.is(results.pages.find(p => p.path === 'js-page').page.type, 'js', 'js-page is type js')
})
