import { join } from 'node:path'
import desm from 'desm'
import { identifyPages } from './identify-pages.js'
import { mkdir } from 'node:fs/promises'

import { pageBuilders } from './page-builders/index.js'
import { buildJs } from './build-js/index.js'
import { buildCss } from './build-css/index.js'
import { buildPages } from './build-pages/index.js'
import { buildStatic } from './build-static/index.js'

/**
 * Build the site
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
async function build (src, dest) {
  const siteData = await identifyPages(src)

  // TODO: maybe formalize this in identify pages later
  siteData.pages = siteData.pages.filter(p => {
    if (pageBuilders[p.type]) return true
    else console.log(`skipping ${p.path}. unimplemented type ${p.type}`)
    return false
  })

  await ensureDest(src, dest, siteData)

  const [
    copyStaticAssetsResults,
    buildPagesResults,
    buildCssResults,
    buildJsResults
  ] = await Promise.all([
    buildStatic(srcDir, outDir),
    buildPages(src, dest, siteData),
    buildCss(src, dest, siteData),
    buildJs(src, dest, siteData)
  ])

  console.log({
    copyStaticAssetsResults,
    buildPagesResults,
    buildCssResults,
    buildJsResults
  })
}

/**
 * Create folders for each page
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
async function ensureDest (src, dest, siteData) {
  await mkdir(dest, { recursive: true })

  for (const page of siteData.pages) {
    await mkdir(join(dest, page.path), { recursive: true })
  }
}

const __dirname = desm(import.meta.url)

const projectDir = join(__dirname, '..', 'test-project')
const srcDir = join(projectDir, 'src')
const outDir = join(projectDir, 'public')

build(srcDir, outDir).then(() => { console.log('done') }).catch(console.error)

// filewatching brainstorming
//
// build everything
// start a cpx watcher
// start a esbuild watcher
// start a chokidar watcher
//   - if js, md, or html file changes, rebuild it
//   - if a a vars file changes, rebuild the page
//   - if a page css file change, rebuild all pages
//   - if a global or root layout changes, rebuild all pages
//   - if a page is deleted, unregister any js entry points
//   - if a page client is deleted, unregister
//   - TODO full register unregister lifecycle
