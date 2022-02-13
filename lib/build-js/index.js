import { join } from 'path'
import esbuild from 'esbuild'

/**
 * Build all of the bundles
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
export async function buildJs (src, dest, siteData, opts) {
  const entryPoints = []
  if (siteData.globalClient) entryPoints.push(join(src, siteData.globalClient.relname))

  for (const page of siteData.pages) {
    if (page.clientBundle) entryPoints.push(join(src, page.clientBundle.relname))
  }

  const buildOpts = {
    entryPoints: entryPoints,
    logLevel: 'silent',
    bundle: true,
    write: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    outdir: dest,
    target: [
      'es2020'
    ]
  }

  try {
    // esbuild returns { errors:[], warnings: [] } already
    const buildResults = await esbuild.build(buildOpts)
    return { ...buildResults, buildOpts, type: 'js' }
  } catch (err) {
    const report = {
      type: 'js',
      errors: [],
      warnings: [],
      buildOpts
    }
    const buildError = new Error('Error building JS clients', { cause: err })
    buildError.buildOpts = buildOpts
    report.errors.push(buildError)
    return report
  }
}
