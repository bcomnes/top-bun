import { join, relative, basename } from 'path'
import esbuild from 'esbuild'
import { resolveVars } from '../build-pages/resolve-vars.js'

/**
 * @typedef {import('esbuild').Format} EsbuildFormat
 * @typedef {import('esbuild').LogLevel} EsbuildLogLevel
 * @typedef {{[relpath: string]: string}} OutputMap
 * @typedef {import('esbuild').BuildOptions} EsbuildBuildOptions
 * @typedef {Awaited<ReturnType<import('esbuild').build>>} EsbuildBuildResults

 * @typedef {import('../builder.js').BuildStep<
 *          'esbuild',
 *         {
 *           buildResults?: EsbuildBuildResults
 *           buildOpts?: EsbuildBuildOptions,
 *           outputMap?: OutputMap
 *         }
 * >} EsBuildStep
 */

/** @typedef {Awaited<ReturnType<EsBuildStep>>} EsBuildStepResults
 */

/**
 * Build all of the bundles using esbuild.
 *
 * @type {EsBuildStep}
 */
export async function buildEsbuild (src, dest, siteData, _opts) {
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

  /** @type {{
   *  [varName: string]: any
   * }} [description] */
  const define = {}

  if (browserVars) {
    for (const [k, v] of Object.entries(browserVars)) {
      define[k] = JSON.stringify(v)
    }
  }

  /**
   * Represents a mapping from relpaths to strings.
   * @typedef {{[relpath: string]: string}} OutputMap
   */

  const buildOpts = {
    entryPoints,
    /** @type {EsbuildLogLevel} */
    logLevel: 'silent',
    bundle: true,
    write: true,
    /** @type {EsbuildFormat} */
    format: 'esm',
    splitting: true,
    sourcemap: true,
    outdir: dest,
    target: [
      'esnext',
      'chrome118',
      'safari17'
    ],
    define,
    metafile: true,
    entryNames: '[dir]/[name]-[hash]',
    chunkNames: 'chunks/[ext]/[name]-[hash]'
  }

  try {
    const buildResults = await esbuild.build(buildOpts)

    /** @type {OutputMap} */
    const outputMap = {}
    Object.keys(buildResults?.metafile?.outputs || {}).forEach(file => {
      const entryPoint = buildResults?.metafile?.outputs[file]?.entryPoint
      if (entryPoint) {
        outputMap[relative(src, entryPoint)] = relative(dest, file)
      }
    })

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
    return {
      type: 'esbuild',
      errors: buildResults.errors,
      warnings: buildResults.warnings,
      report: {
        buildResults,
        outputMap,
        buildOpts
      }
    }
  } catch (err) {
    return {
      type: 'esbuild',
      errors: [
        new Error('Error building JS+CSS with esbuild', { cause: err })
      ],
      warnings: [],
      report: {}
    }
  }
}
