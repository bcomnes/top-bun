import { promisify } from 'node:util'
import cpx from 'cpx2'
const copy = promisify(cpx.copy)

export function getCopyGlob (src) {
  return `${src}/**/*.!(js|css|html|md)`
}

/**
 * run CPX2 on src folder
 */
export function buildStatic (src, dest, opts = {}) {
  return copy(getCopyGlob(src), dest, { ignore: opts.ignore })
}
