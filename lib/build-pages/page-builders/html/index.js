import assert from 'node:assert'
import { readFile } from 'fs/promises'
import Handlebars from 'handlebars'

/**
 * @template T
 * @typedef {import('../page-writer.js').PageBuilderType<T>} PageBuilderType
 */

/**
 * Build all of the bundles using esbuild.
 * @template T
 * @type {PageBuilderType<T>}
 */
export async function htmlBuilder ({ pageInfo }) {
  assert(pageInfo.type === 'html', 'html builder requires a "html" page type')

  const fileContents = await readFile(pageInfo.pageFile.filepath, 'utf8')

  return {
    vars: {},
    pageLayout: async (vars) => {
      const template = Handlebars.compile(fileContents)
      return template(vars)
    }
  }
}
