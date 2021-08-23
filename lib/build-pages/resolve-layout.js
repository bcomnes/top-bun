/**
 * layout resolve code
 * @param  {[type]} layoutPath [description]
 * @return {[type]}            [description]
 */
export async function resolveLayout (layoutPath) {
  const { default: layout } = await import(layoutPath)

  return layout
}
