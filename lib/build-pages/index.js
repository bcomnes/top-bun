import { Worker } from 'worker_threads'
import desm from 'desm'
import { join } from 'path'
import pMap from 'p-map'

import { resolveVars } from './resolve-vars.js'
import { resolveLayout } from './resolve-layout.js'
import { pageBuilders, templateBuilder } from './page-builders/index.js'
import { PageData } from './page-data.js'
import { pageBuilder } from './page-builders/page-builder.js'

const __dirname = desm(import.meta.url)

// TODO: make this extendible maybe
export { pageBuilders }

/**
 * Page builder glue. Most of the magic happens in the builders.
 */
export function buildPages (src, dest, siteData, opts) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, 'worker.js'), {
      workerData: { src, dest, siteData }
    })

    worker.once('message', report => {
      if (report.errors.length > 0) {
        // Put the errorData on the error to be consistent with the rest of the builders.
        report.errors = report.errors.map(({ error, errorData = {} }) => {
          for (const [key, val] of Object.entries(errorData)) {
            error[key] = val
          }
          return error
        })
      }
      resolve(report)
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
 */
export async function buildPagesDirect (src, dest, siteData) {
  const report = {
    type: 'page',
    success: [],
    errors: [],
    warnings: []
  }

  const [
    defaultVarsResults,
    globalVarsResults
  ] = await Promise.allSettled([
    resolveVars(join(__dirname, '../defaults/default.vars.js')),
    resolveVars(siteData?.globalVars?.filepath)
  ])

  if (defaultVarsResults.status === 'rejected') {
    report.errors.push(
      {
        error: new Error('Encountered an error when resolving defaultVars', {
          cause: defaultVarsResults.reason
        })
      }
    )
  }

  if (globalVarsResults.status === 'rejected') {
    report.errors.push(
      {
        error: new Error('Encountered an error when resolving globalVars', {
          cause: globalVarsResults.reason
        })
      }
    )
  }

  const resolvedLayoutResults = await Promise.allSettled(
    Object.entries(siteData.layouts).map(async ([name, layout]) => [name, await resolveLayout(layout.filepath)])
  )

  const resolvedLayouts = {}

  for (const resolvedLayoutResult of resolvedLayoutResults) {
    if (resolvedLayoutResult.status === 'rejected') {
      report.errors.push(
        {
          error: new Error('Error resolving a layout', {
            cause: resolvedLayoutResult.reason
          })
        }
      )
    } else {
      const layoutName = resolvedLayoutResult.value[0]
      const layoutFn = resolvedLayoutResult.value[1]
      const layoutStyle = siteData.layouts?.[layoutName]?.layoutStyle
      const layoutStylePath = layoutStyle?.outputRelname

      const layoutClient = siteData.layouts?.[layoutName]?.layoutClient
      const layoutClientPath = layoutClient?.outputRelname

      resolvedLayouts[layoutName] = {
        render: layoutFn,
        layoutStylePath: layoutStylePath ? `/${layoutStylePath}` : null,
        layoutClientPath: layoutClientPath ? `/${layoutClientPath}` : null
      }
    }
  }

  if (report.errors.length > 0) return report // Return early, these will all fail.

  // Default vars is an internal detail, here we create globalVars that the user sees.
  const globalVars = {
    ...defaultVarsResults.value,
    ...globalVarsResults.value
  }

  // Mix in resolveVars, renderInnerPage and renderFullPage methods
  const pages = await pMap(siteData.pages, async (page) => {
    try {
      const pageData = new PageData({
        page,
        globalVars,
        globalStyle: siteData?.globalStyle?.outputRelname,
        globalClient: siteData?.globalClient?.outputRelname
      })
      await pageData.init({ layouts: resolvedLayouts })
      return pageData
    } catch (err) {
      const variableResolveError = new Error('Error resolving page vars', { cause: err })
      // I can't put stuff on the error, the worker swallows it for some reason.
      report.errors.push({ error: variableResolveError, errorData: { page } })
    }
  }, { concurrency: 4 })

  if (report.errors.length > 0) return report // Return early, these will all fail.

  for (const page of pages) {
    try {
      const buildResult = await pageBuilder({
        src,
        dest,
        page,
        pages
      })

      report.success.push(buildResult)
    } catch (err) {
      const buildError = new Error('Error building page', { cause: err })
      // I can't put stuff on the error, the worker swallows it for some reason.
      report.errors.push({ error: buildError, errorData: { page } })
    }
  }

  for (const template of siteData.templates) {
    try {
      const buildResult = await templateBuilder({
        src,
        dest,
        globalVars,
        template,
        pages
      })

      report.success.push(buildResult)
    } catch (err) {
      const buildError = new Error('Error building template', { cause: err })
      // I can't put stuff on the error, the worker swallows it for some reason.
      report.errors.push({ error: buildError, errorData: { template } })
    }
  }

  return report
}
