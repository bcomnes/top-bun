import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

/**
 * @typedef {import('../../identify-pages.js').PageInfo} PageInfo
 */

/**
 * @template T extends Object.<string, any>
 * @typedef {import('../page-data.js').PageData<T>} PageData
 */

/**
 * pageLayout functions Can be used to type a name.layout.js file
 *
 * @async
 * @template T extends Object.<string, any>
 * @callback PageFunction
 * @param {object} params - The parameters for the pageLayout.
 * @param {T} params.vars - All default, global, layout, page, and builder vars shallow merged.
 * @param {string[]} [params.scripts] - Array of script URLs to include.
 * @param {string[]} [params.styles] - Array of stylesheet URLs to include.
 * @param {PageInfo} params.page - Info about the current page
 * @param {PageData<T>[]} params.pages - An array of info about every page
 * @returns {Promise<any>} The rendered inner page thats compatible with its matched layout
 */

/**
 * @template T extends Object.<string, any>
 * @typedef PageBuilderResult
 * @property {object} vars - Any variables resolved by the builder
 * @property {PageFunction<T>} pageLayout - The function that returns the rendered page
 */

/**
 * @template T extends Object.<string, any>
 * @callback PageBuilderType
 *
 * @param {object} params
 * @param {PageInfo} params.pageInfo
 * @returns {Promise<PageBuilderResult<T>>} - The results of the build step.
 */

/**
 * Handles rendering and writing a page to disk
 * @template T extends object
 * @param {object} params
 * @param {string} params.src   - The src folder.
 * @param {string} params.dest  - The dest folder.
 * @param {PageData<T>} params.page  - The PageInfo object of the current page
 * @param {PageData<T>[]} params.pages - The PageInfo[] array of all pages
 */
export async function pageWriter ({
  dest,
  page,
  pages
}) {
  if (!page.pageInfo) throw new Error('Uninitialzied page detected')
  const pageDir = join(dest, page.pageInfo.path)
  const pageFilePath = join(pageDir, page.pageInfo.outputName)

  const formattedPageOutput = await page.renderFullPage({ pages })
  await mkdir(pageDir, { recursive: true })
  await writeFile(pageFilePath, formattedPageOutput)

  return { pageFilePath }
}
