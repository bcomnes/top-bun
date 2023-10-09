import { join, relative, basename } from 'path'
import esbuild from 'esbuild'
import { resolveVars } from '../build-pages/resolve-vars.js'

/**
 * Build all of the bundles
 * @param  {string} src      Path string of the site src
 * @param  {string} dest     Path string of the site build dest
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
export async function buildEsbuild (src, dest, siteData, opts) {
  const entryPoints = []
  if (siteData.globalClient) entryPoints.push(join(src, siteData.globalClient.relname))
  if (siteData.globalStyle) entryPoints.push(join(src, siteData.globalStyle.relname))

  for (const page of siteData.pages) {
    if (page.clientBundle) entryPoints.push(join(src, page.clientBundle.relname))
    if (page.pageStyle) entryPoints.push(join(src, page.pageStyle.relname))
  }

  for (const layout of Object.values(siteData.layouts)) {
    if (layout.layoutClient) entryPoints.push(join(src, layout.layoutClient.relname))
    if (layout.layoutStyle) entryPoints.push(join(src, layout.layoutStyle.relname))
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
    const { outputMap, ...buildResults } = await esbuild.build(buildOpts)

    // Add output names to siteData
    for (const page of siteData.pages) {
      if (page.pageStyle) {
        const outputRelname = outputMap[page.pageStyle.relname]
        if (outputRelname) {
          page.pageStyle.outputRelname = outputRelname
          page.pageStyle.outputName = basename(outputRelname)
        }
      }

      if (page.clientBundle) {
        const outputRelname = outputMap[page.clientBundle.relname]
        if (outputRelname) {
          page.clientBundle.outputRelname = outputRelname
          page.clientBundle.outputName = basename(outputRelname)
        }
      }
    }

    if (siteData.globalClient) {
      const outputRelname = outputMap[siteData.globalClient.relname]
      if (outputRelname) {
        siteData.globalClient.outputRelname = outputRelname
        siteData.globalClient.outputName = basename(outputRelname)
      }
    }

    if (siteData.globalStyle) {
      const outputRelname = outputMap[siteData.globalStyle.relname]
      if (outputRelname) {
        siteData.globalStyle.outputRelname = outputRelname
        siteData.globalStyle.outputName = basename(outputRelname)
      }
    }

    for (const layout of Object.values(siteData.layouts)) {
      if (layout.layoutStyle) {
        const outputRelname = outputMap[layout.layoutStyle.relname]
        if (outputRelname) {
          layout.layoutStyle.outputRelname = outputRelname
          layout.layoutStyle.outputName = basename(outputRelname)
        }
      }

      if (layout.layoutClient) {
        const outputRelname = outputMap[layout.layoutClient.relname]
        if (outputRelname) {
          layout.layoutClient.outputRelname = outputRelname
          layout.layoutClient.outputName = basename(outputRelname)
        }
      }
    }

    return { ...buildResults, buildOpts, type: 'esbuild' }
  } catch (err) {
    const report = {
      type: 'esbuild',
      errors: [],
      warnings: [],
      buildOpts
    }
    const buildError = new Error('Error building JS+CSS with esbuild', { cause: err })
    buildError.buildOpts = buildOpts
    report.errors.push(buildError)
    return report
  }
}
