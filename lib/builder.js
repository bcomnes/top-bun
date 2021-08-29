import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { buildPages, pageBuilders } from './build-pages/index.js'
import { identifyPages } from './identify-pages.js'
import { buildStatic } from './build-static/index.js'
import { buildCss } from './build-css/index.js'
import { buildJs } from './build-js/index.js'

/**
 * Build the site
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
export async function build (src, dest) {
  const siteData = await identifyPages(src, pageBuilders)

  // TODO: we need an improved reporting mechanism. Logging for now
  for (const warning of siteData.warnings) {
    console.warn(`${warning.error}: ${warning.message}`)
  }

  await ensureDest(src, dest, siteData)

  const results = await Promise.all([
    buildStatic(src, dest),
    buildPages(src, dest, siteData),
    buildCss(src, dest, siteData),
    buildJs(src, dest, siteData)
  ])

  return results
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
