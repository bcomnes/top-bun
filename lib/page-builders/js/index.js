import assert from 'webassert'

export async function jsBuilder ({ page }) {
  assert(page.type === 'js', 'js page builder requries "js" page type')
  // TODO: do I need to eval this or something? or put a qs on this
  const { default: pageLayout, vars } = await import(page.page.filepath)
  assert(pageLayout, 'js pages must export a page layout default export')

  return { vars, pageLayout }
}
