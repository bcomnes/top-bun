/**
 * @template T
 * @template {keyof T} K
 * @param {T[]} array
 * @param {K} key
 * @returns {Record<string, T>}
 */
export function keyByKey (array, key) {
  return array.reduce(
    /**
     * @param {Record<string, T>} acc
     * @param {T} item
     */
    (acc, item) => {
      const keyValue = String(item[key])
      acc[keyValue] = item
      return acc
    },
    /** @type {Record<string, T>} */ ({})
  )
}

/**
 * @template T
 * @param {T[]} array
 * @param {(item: T) => string} fn
 * @returns {Record<string, T>}
 */
export function keyByFn (array, fn) {
  return array.reduce(
    /**
     * @param {Record<string, T>} acc
     * @param {T} item
     */
    (acc, item) => {
      const keyValue = fn(item)
      acc[keyValue] = item
      return acc
    },
    /** @type {Record<string, T>} */ ({})
  )
}

/**
 * This is a merged JSDoc comment that provides hints about the possible
 * function signatures. The TypeScript checker will use this to infer
 * the appropriate type based on how the function is called.
 *
 * @template T
 * @param {T[]} array
 * @param {keyof T | ((item: T) => string)} keyOrFn
 * @returns {Record<string, T>}
 */
export function keyBy (array, keyOrFn) {
  if (typeof keyOrFn === 'function') {
    return keyByFn(array, keyOrFn)
  } else {
    return keyByKey(array, keyOrFn)
  }
}
