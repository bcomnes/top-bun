/**
 * @typedef {import('../identify-pages.js').PageInfo} PageInfo
 */

/**
 * @template {Record<string, any>} T
 * @typedef {import('./page-data.js').PageData<T>} PageData
 */

/**
 * Callback for rendering a layout.
 *
 * @template T
 * @callback LayoutFunction
 * @param {object} params - The parameters for the layout.
 * @param {T} params.vars - All default, global, layout, page, and builder vars shallow merged.
 * @param {string[]} [params.scripts] - Array of script URLs to include.
 * @param {string[]} [params.styles] - Array of stylesheet URLs to include.
 * @param {any} params.children - The children content, either as a string or a render function.
 * @param {PageInfo} params.page - Info about the current page
 * @param {PageData<T>[]} params.pages - An array of info about every page
 * @returns {Promise<string>} The rendered HTML string.
 */

/**
 * Resolves a layout from an ESM module.
 *
 * @async
 * @function
 * @template T
 * @param {string} layoutPath - The string path to the layout ESM module.
 * @returns {Promise<LayoutFunction<T>>} The resolved layout exported as default from the module.
 */
export async function resolveLayout (layoutPath) {
  const { default: layout } = await import(layoutPath)

  return layout
}
