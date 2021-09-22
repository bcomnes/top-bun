/**
 * Resolve vars imports a vars file
 * @param  {[type]} varsPath [description]
 * @return {[type]}          [description]
 */
export async function resolveVars (varsPath) {
  if (!varsPath) return {}

  const nonce = new URLSearchParams({ nonce: new Date() })
  const { default: maybeVars } = await import(`${varsPath}?${nonce}`)

  if (typeof maybeVars === 'function') return maybeVars()
  return maybeVars
}
