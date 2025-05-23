import assert from 'node:assert'

/**
 * Build all of the bundles using esbuild.
 * @template {Record<string, any>} T
 * @type {import('../page-writer.js').PageBuilderType<T>}
 */
export async function jsBuilder ({ pageInfo }) {
  assert(pageInfo.type === 'js', 'js page builder requries "js" page type')

  const { default: pageLayout, vars } = await import(pageInfo.pageFile.filepath)

  assert(pageLayout, 'js pages must export a page layout default export')
  assert(typeof pageLayout === 'function', 'js pages pageLayout must be a function')

  return { vars, pageLayout }
}
