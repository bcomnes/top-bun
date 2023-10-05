/**
 * layout resolve code from an esm
 * @param  {string} layoutPath The string path to the layout
 * @return {[type]}            [description]
 */
export async function resolveLayout (layoutPath) {
  const { default: layout } = await import(layoutPath)

  return layout
}
