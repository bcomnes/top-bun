/**
 * Resolve variables by importing them from a specified path.
 *
 * @param {string} [varsPath] - Path to the file containing the variables.
 * @param {string} [key='default'] - The key to extract from the imported module. Default: 'default'
 * @returns {Promise<object>} - Returns the resolved variables. If the imported variable is a function, it executes and returns its result. Otherwise, it returns the variable directly.
 */
export async function resolveVars (varsPath, key = 'default') {
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
