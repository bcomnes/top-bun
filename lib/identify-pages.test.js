import tap from 'tap'
import desm from 'desm'
import { resolve } from 'path'

import { identifyPages } from './identify-pages.js'
import { pageBuilders } from './build-pages/index.js'

const __dirname = desm(import.meta.url)

tap.test('identifyPages works as expected', async (t) => {
  const results = await identifyPages(resolve(__dirname, '../test-cases/general-features/src'), pageBuilders)
  // console.log(results)
  t.ok(results.globalStyle, 'Global style is found')
  t.ok(results.globalVars, 'Global variabls are found')
  t.ok(results.layouts, 'Layouts are found')
  t.ok(results.layouts.root, 'A root layouts is found')
  t.equal(Object.keys(results.pages).length, 18, '18 pages are found')

  t.equal(results.warnings.length, 0, '0 warnings produced')
  t.equal(results.nonPageFolders.length, 4, '4 non-page-folder')
  t.equal(results.pages.find(p => p.path === 'html-page').page.type, 'html', 'html page is type html')
  t.equal(results.pages.find(p => p.path === 'md-page').page.type, 'md', 'md page is type md')
  t.equal(results.pages.find(p => p.path === 'js-page').page.type, 'js', 'js-page is type js')
})
