import { promisify } from 'node:util'
import cpx from 'cpx2'
const copy = promisify(cpx.copy)

/**
 * run CPX2 on src folder
 * @param  {[type]} src  [description]
 * @param  {[type]} dest [description]
 * @return {[type]}      [description]
 */
export function buildStatic (src, dest) {
  const glob = `${src}/**/*.{png,svg,jpg,jpeg,pdf,mp4,mp3,json,gif}`
  return copy(glob, dest)
}
