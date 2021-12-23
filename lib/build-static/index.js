import cpx from 'cpx2'
const copy = cpx.copy

export function getCopyGlob (src) {
  // TODO: make this customizeable?
  return `${src}/**/!(*.js|*.css|*.html|*.md)`
}

/**
 * run CPX2 on src folder
 */
export async function buildStatic (src, dest, opts = {}) {
  return await copy(getCopyGlob(src), dest, { ignore: opts.ignore })
}
