import assert from 'webassert'
import { readFile } from 'node:fs/promises'

export async function htmlBuilder ({ page }) {
  assert(page.type === 'html', 'html builder requires a "html" page type')

  const fileContents = await readFile(page.page.filepath, 'utf8')

  return {
    vars: {},
    pageLayout: vars => fileContents
  }
}
