import { sep } from 'node:path'

/**
 * Convert a path to a URL for the site.
 * @param  {[type]} fsPath [description]
 * @return {[type]}        [description]
 */
export function fsPathToUrlPath (fsPath) {
  return '/' + fsPath.split(sep).join('/')
}
