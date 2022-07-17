/**
 * Resolve vars imports a vars file
 * @param  {[type]} varsPath [description]
 * @return {[type]}          [description]
 */
export async function resolveVars (varsPath, key = 'default') {
  if (!varsPath) return {}

  const { [key]: maybeVars } = await import(varsPath)

  if (typeof maybeVars === 'function') return maybeVars()
  return maybeVars
}
