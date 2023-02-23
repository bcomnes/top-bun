import { join, relative } from 'path'
import esbuild from 'esbuild'
import { resolveVars } from '../build-pages/resolve-vars.js'

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

  const browserVars = await resolveVars(siteData?.globalVars?.filepath, 'browser')

  const define = {}

  if (browserVars) {
    for (const [k, v] of Object.entries(browserVars)) {
      define[k] = JSON.stringify(v)
    }
  }

  const mapOutputToEntry = {
    name: 'mapOutputToEntry',
    setup (build) {
      build.onEnd(result => {
        const ob = {}
        Object.keys(result?.metafile?.outputs || {}).forEach(file => {
          const { entryPoint } = result.metafile.outputs[file]
          if (entryPoint) {
            ob[relative(src, entryPoint)] = relative(dest, file)
          }
        })
        result.outputMap = ob
      })
    }
  }

  const buildOpts = {
    entryPoints,
    logLevel: 'silent',
    bundle: true,
    write: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    outdir: dest,
    target: [
      'esnext'
    ],
    define,
    metafile: true,
    entryNames: '[dir]/[name]-[hash]',
    chunkNames: 'chunks/[ext]/[name]-[hash]',
    plugins: [mapOutputToEntry]
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
