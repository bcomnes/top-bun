import assert from 'node:assert'
import { readFile } from 'fs/promises'

export async function htmlBuilder ({ page }) {
  assert(page.type === 'html', 'html builder requires a "html" page type')

  const fileContents = await readFile(page.page.filepath, 'utf8')

  return {
    vars: {},
    pageLayout: vars => fileContents
  }
}
