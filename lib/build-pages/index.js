import { resolveVars } from './resolve-vars.js'
import { resolveLayout } from './resolve-layout.js'
import { pageBuilders } from './page-builders/index.js'

// TODO: make this extendible maybe
export { pageBuilders }

/**
 * Page builder glue. Most of the magic happens in the builders
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
export async function buildPages (src, dest, siteData) {
  const [
    globalVars,
    rootLayout
  ] = await Promise.all([
    resolveVars(siteData?.globalVars?.filepath),
    resolveLayout(siteData?.rootLayout?.filepath)
  ])

  const results = []
  for (const page of siteData.pages) {
    const builder = pageBuilders[page.type]
    // This should never happen
    if (!builder) throw new Error(`Can't build ${page.path}. unimplemented type ${page.type}`)

    globalVars.styles = siteData.globalStyle ? ['/global.css'] : []
    globalVars.scripts = siteData.globalClient ? ['/global.client.js'] : []

    const result = await builder({ src, dest, page, globalVars, rootLayout })
    results.push(result)
  }

  return results
}
