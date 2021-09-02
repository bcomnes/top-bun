import { join } from 'node:path'
import esbuild from 'esbuild'

/**
 * Build all of the bundles
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
export async function buildJs (src, dest, siteData) {
  const entryPoints = []
  if (siteData.globalClient) entryPoints.push(join(src, siteData.globalClient.relname))

  for (const page of siteData.pages) {
    if (page.clientBundle) entryPoints.push(join(src, page.clientBundle.relname))
  }

  const results = await esbuild.build({
    entryPoints: entryPoints,
    bundle: true,
    write: true,
    format: 'esm',
    splitting: true,
    sourcemap: 'both',
    outdir: dest,
    target: [
      'es2020'
    ]
  })

  return results
}
