/**
 * layout resolve code
 * @param  {[type]} layoutPath [description]
 * @return {[type]}            [description]
 */
export async function resolveLayout (layoutPath) {
  const nonce = new URLSearchParams({ nonce: new Date() })
  const { default: layout } = await import(`${layoutPath}?${nonce}`)

  return layout
}
