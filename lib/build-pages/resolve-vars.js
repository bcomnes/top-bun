/**
 * @typedef {import('../identify-pages.js').PageInfo} PageInfo
 */

/**
 * @template T
 * @typedef {import('./page-data.js').PageData<T>} PageData
 */

/**
 * Resolve variables by importing them from a specified path.
 *
 * @param {object} params
 * @param {string} [params.varsPath] - Path to the file containing the variables.
 * @param {object} [params.resolveVars] - Any variables you want passed to the reolveFunction.
 * @param {string} [params.key='default'] - The key to extract from the imported module. Default: 'default'
 * @returns {Promise<object|function>} - Returns the resolved variables. If the imported variable is a function, it executes and returns its result. Otherwise, it returns the variable directly.
 */
export async function resolveVars ({
  varsPath,
  key = 'default',
}) {
  if (!varsPath) return {}

  const imported = await import(varsPath)

  const maybeVars = imported[key]

  if (isObject(maybeVars)) {
    return maybeVars
  } else if (isFunction(maybeVars)) {
    const resolvedVars = await maybeVars()
    if (isObject(resolvedVars)) {
      return resolvedVars
    } else {
      throw new Error('Var functions must resolve to an object')
    }
  } else {
    return {}
  }
}

/**
 * postVars functions Can be used to generate page vars but access all page data
 *
 * @async
 * @template T extends Object.<string, any>
 * @callback PostVarsFunction
 * @param {object} params - The parameters for the pageLayout.
 * @param {T} params.vars - All default, global, layout, page, and builder vars shallow merged.
 * @param {string[]} [params.scripts] - Array of script URLs to include.
 * @param {string[]} [params.styles] - Array of stylesheet URLs to include.
 * @param {PageInfo} params.page - Info about the current page
 * @param {PageData<T>[]} params.pages - An array of info about every page
 * @returns {Promise<T>} The rendered postVars
 */

/**
 * Resolve variables by importing them from a specified path.
 *
 * @param {object} params
 * @param {string} [params.varsPath] - Path to the file containing the variables.
 * @returns {Promise<function|null>} - Returns the resolved variables. If the imported variable is a function, it executes and returns its result. Otherwise, it returns the variable directly.
 */
export async function resolvePostVars ({
  varsPath,
}) {
  if (!varsPath) return null

  const imported = await import(varsPath)
  const maybePostVars = imported.postVars

  if (maybePostVars) {
    if (isFunction(maybePostVars)) {
      return maybePostVars
    } else {
      throw new Error('postVars must export a function')
    }
  } else {
    return null
  }
}

/**
 * Checks if the given value is an object.
 *
 * @param {*} value - The value to check.
 * @returns {value is object}
 */
function isObject (value) {
  return value !== null && typeof value === 'object'
}

/**
 * Checks if the given value is an object.
 *
 * @param {*} value - The value to check.
 * @returns {value is function}
 */
function isFunction (value) {
  return value !== null && typeof value === 'function'
}
