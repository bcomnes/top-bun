import assert from 'webassert'

export async function jsBuilder ({ page }) {
  assert(page.type === 'js', 'js page builder requries "js" page type')

  const nonce = new URLSearchParams({ nonce: new Date() })
  const { default: pageLayout, vars } = await import(`${page.page.filepath}?${nonce}`)

  assert(pageLayout, 'js pages must export a page layout default export')

  return { vars, pageLayout }
}
