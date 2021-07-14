import tap from 'tap'
import desm from 'desm'
import { join } from 'node:path'

import { identifyPages } from './identify-pages.js'

const __dirname = desm(import.meta.url)

tap.test('identifyPages works as expected', async (t) => {
  const results = await identifyPages(join(__dirname, '..', 'test-project', 'src'))
  // console.log(results)
  t.ok(results.globalStyle, 'Global style is found')
  t.ok(results.globalVars, 'Global variabls are found')
  t.ok(results.rootLayout, 'Root layout file is found')
  t.equal(Object.keys(results.pages).length, 5, '5 pages are found')

  t.equal(results.warnings.length, 1, '1 warnings produced')
  t.equal(results.nonPageFolders.length, 1, '1 non-page-folder')

  t.equal(results.pages['html-page'].page.type, 'html', 'html page is type html')
  t.equal(results.pages['md-page'].page.type, 'md', 'md page is type md')
  t.equal(results.pages['a-page'].page.type, 'js', 'a-page is type js')
})
