import { Worker } from 'worker_threads'
import desm from 'desm'
import { join } from 'path'
import pMap from 'p-map'
import { cpus } from 'os'

import { keyBy } from '../helpers/key-by.js'
import { resolveVars } from './resolve-vars.js'
import { resolveLayout } from './resolve-layout.js'
import { pageBuilders, templateBuilder } from './page-builders/index.js'
import { PageData } from './page-data.js'
import { pageWriter } from './page-builders/page-writer.js'

const MAX_CONCURRENCY = Math.min(cpus().length, 24)

const __dirname = desm(import.meta.url)

/**
 * @typedef {{
 *   pages: Awaited<ReturnType<typeof pageWriter>>[]
 *   templates: Awaited<ReturnType<typeof templateBuilder>>[]
 * }} PageBuilderReport
 */

/**
 * @typedef {import('../builder.js').BuildStep<
 *          'page',
 *          PageBuilderReport
 *          >} PageBuildStep
 */

/**
 * @typedef {Awaited<ReturnType<PageBuildStep>>} PageBuildStepResult
 */

/**
 * @template T
 * @typedef {import('./resolve-layout.js').LayoutFunction<T>} LayoutFunction
 */

/**
 * @template T
 * @typedef ResolvedLayout
 * @property {LayoutFunction<T>} render - The layout function
 * @property {string} name - The name of the layout
 * @property {string | null} layoutStylePath - The string path to the layout style
 * @property {string | null} layoutClientPath - The string path to the layout client
 */

/**
  * @typedef {Omit<PageBuildStepResult, 'errors'> & { errors: {error: Error, errorData?: object}[] }} WorkerBuildStepResult
 */

export { pageBuilders }

/**
 * Page builder glue. Most of the magic happens in the builders.
 *
 * @type {PageBuildStep}
 */
export function buildPages (src, dest, siteData, _opts) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, 'worker.js'), {
      workerData: { src, dest, siteData }
    })

    worker.once('message', message => {
      /** @type { WorkerBuildStepResult }  */
      const workerReport = message

      /** @type {PageBuildStepResult} */
      const buildReport = {
        type: workerReport.type,
        report: workerReport.report,
        errors: [],
        warnings: workerReport.warnings ?? []
      }

      if (workerReport.errors.length > 0) {
        // Put the errorData on the error to be consistent with the rest of the builders.
        buildReport.errors = workerReport.errors.map(({ error, errorData = {} }) => {
          for (const [key, val] of Object.entries(errorData)) {
            // @ts-ignore
            error[key] = val
          }
          return error
        })
      }
      resolve(buildReport)
    })
    worker.once('error', reject)
    worker.once('exit', (code) => {
      if (code !== 0) { reject(new Error(`Worker stopped with exit code ${code}`)) }
    })
  })
}

/**
 * Directly build pages. Normally you run this in a worker.
 * All layouts, variables and page builders need to resolve in here
 * so that it can be run more than once, after the source files change.
 *
  * @type {(...args: Parameters<PageBuildStep>) => Promise<WorkerBuildStepResult>} WorkerBuildStep
 */
export async function buildPagesDirect (src, dest, siteData, _opts) {
  /** @type {WorkerBuildStepResult} */
  const result = {
    type: 'page',
    report: {
      pages: [],
      templates: []
    },
    errors: [],
    warnings: []
  }

  const [
    defaultVars,
    bareGlobalVars
  ] = await Promise.all([
    resolveVars({
      varsPath: join(__dirname, '../defaults/default.vars.js')
    }),
    resolveVars({
      varsPath: siteData?.globalVars?.filepath
    })
  ])

  /** @type {ResolvedLayout<object>[]} */
  const resolvedLayoutResults = await pMap(Object.values(siteData.layouts), async (layout) => {
    const render = await resolveLayout(layout.filepath)
    return {
      render,
      name: layout.layoutName,
      layoutStylePath: layout.layoutStyle ? `/${layout.layoutStyle.outputRelname}` : null,
      layoutClientPath: layout.layoutClient ? `/${layout.layoutClient.outputRelname}` : null
    }
  }, { concurrency: MAX_CONCURRENCY })

  const resolvedLayouts = keyBy(resolvedLayoutResults, 'name')

  // Default vars is an internal detail, here we create globalVars that the user sees.
  /** @type {object} */
  const globalVars = {
    ...defaultVars,
    ...(siteData.defaultStyle ? { defaultStyle: true } : {}),
    ...bareGlobalVars
  }

  // Mix in resolveVars, renderInnerPage and renderFullPage methods
  const pages = await pMap(siteData.pages, async (pageInfo) => {
    const pageData = new PageData({
      pageInfo,
      globalVars,
      globalStyle: siteData?.globalStyle?.outputRelname,
      globalClient: siteData?.globalClient?.outputRelname,
      defaultStyle: siteData?.defaultStyle,
      defaultClient: siteData?.defaultClient
    })
    try {
      // Resolves async vars and binds the page to a reference to its layout fn
      await pageData.init({ layouts: resolvedLayouts })
    } catch (err) {
      if (!(err instanceof Error)) throw new Error('Non-error thrown while resolving vars', { cause: err })
      const variableResolveError = new Error('Error resolving page vars', { cause: { message: err.message, stack: err.stack } })
      // I can't put stuff on the error, the worker swallows it for some reason.
      result.errors.push({ error: variableResolveError, errorData: { page: pageInfo } })
    }
    return pageData
  }, { concurrency: MAX_CONCURRENCY })

  if (result.errors.length > 0) return result

  /** @type {[number, number]} Divided concurrency valus */
  const dividedConcurrency = MAX_CONCURRENCY % 2
    ? [((MAX_CONCURRENCY - 1) / 2) + 1, (MAX_CONCURRENCY - 1) / 2] // odd
    : [MAX_CONCURRENCY / 2, MAX_CONCURRENCY / 2] // even

  await Promise.all([
    pMap(pages, async (page) => {
      try {
        const buildResult = await pageWriter({
          src,
          dest,
          page,
          pages
        })

        result.report.pages.push(buildResult)
      } catch (err) {
        const buildError = new Error('Error building page', { cause: err })
        // I can't put stuff on the error, the worker swallows it for some reason.
        result.errors.push({ error: buildError, errorData: { page: page.pageInfo } })
      }
    }, { concurrency: dividedConcurrency[0] }),
    pMap(siteData.templates, async (template) => {
      try {
        const buildResult = await templateBuilder({
          src,
          dest,
          globalVars,
          template,
          pages
        })

        result.report.templates.push(buildResult)
      } catch (err) {
        if (!(err instanceof Error)) throw new Error('Non-error thrown while building pages', { cause: err })
        const buildError = new Error('Error building template', { cause: { message: err.message, stack: err.stack } })
        // I can't put stuff on the error, the worker swallows it for some reason.
        result.errors.push({ error: buildError, errorData: { template } })
      }
    }, { concurrency: dividedConcurrency[1] })
  ])

  return result
}
