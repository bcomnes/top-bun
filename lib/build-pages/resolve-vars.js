/**
 * Resolve vars imports a vars file
 * @param  {[type]} varsPath [description]
 * @return {[type]}          [description]
 */
export async function resolveVars (varsPath) {
  if (!varsPath) return {}

  // TODO: cache bust this?
  const { default: maybeVars } = await import(varsPath)

  if (typeof maybeVars === 'function') return maybeVars()
  return maybeVars
}
