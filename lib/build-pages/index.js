import { Worker } from 'worker_threads'
import desm from 'desm'
import { join } from 'path'

import { resolveVars } from './resolve-vars.js'
import { resolveLayout } from './resolve-layout.js'
import { pageBuilders } from './page-builders/index.js'

const __dirname = desm(import.meta.url)

// TODO: make this extendible maybe
export { pageBuilders }

/**
 * Page builder glue. Most of the magic happens in the builders.
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
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
 * @param  {[type]} src      [description]
 * @param  {[type]} dest     [description]
 * @param  {[type]} siteData [description]
 * @return {[type]}          [description]
 */
export async function buildPagesDirect (src, dest, siteData) {
  const report = {
    type: 'page',
    success: [],
    errors: [],
    warnings: []
  }

  const [
    defaultVars,
    globalVars
  ] = await Promise.allSettled([
    resolveVars(join(__dirname, '../defaults/default.vars.js')),
    resolveVars(siteData?.globalVars?.filepath)
  ])

  if (defaultVars.status === 'rejected') {
    report.errors.push(
      {
        error: new Error('Encountered an error when resolving defaultVars', {
          cause: defaultVars.reason
        })
      }
    )
  }

  if (globalVars.status === 'rejected') {
    report.errors.push(
      {
        error: new Error('Encountered an error when resolving globalVars', {
          cause: globalVars.reason
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
            cause: defaultVars.reason
          })
        }
      )
    } else {
      const layoutName = resolvedLayoutResult.value[0]
      const layoutFn = resolvedLayoutResult.value[1]
      const layoutStyle = siteData.layouts?.[layoutName]?.layoutStyle
      const layoutStylePath = layoutStyle?.outputRelname ?? layoutStyle?.relname

      const layoutClient = siteData.layouts?.[layoutName]?.layoutClient
      const layoutClientPath = layoutClient?.outputRelname ?? layoutClient?.relname

      resolvedLayouts[layoutName] = {
        render: layoutFn,
        layoutStylePath: layoutStylePath ? `/${layoutStylePath}` : null,
        layoutClientPath: layoutClientPath ? `/${layoutClientPath}` : null
      }
    }
  }

  if (report.errors.length > 0) return report // Return early, these will all fail.

  const globalClientPath = `/${siteData?.globalClient?.outputRelname ?? siteData?.globalClient?.relname}`
  const globalStylePath = `/${siteData?.globalStyle?.outputRelname ?? siteData?.globalStyle?.relname}`

  for (const page of siteData.pages) {
    try {
      const builder = pageBuilders[page.type]
      // This should never happen
      if (!builder) throw new Error(`Can't build ${page.path}. unimplemented type ${page.type}`)

      // Supplement global vars with some global styles and clients
      globalVars.value.styles = siteData.globalStyle ? [globalStylePath] : []
      globalVars.value.scripts = siteData.globalClient ? [globalClientPath] : []

      const buildResult = await builder({
        src,
        dest,
        page,
        siteData,
        layouts: resolvedLayouts,
        defaultVars: defaultVars.value,
        globalVars: globalVars.value
      })

      report.success.push(buildResult)
    } catch (err) {
      const buildError = new Error('Error building page', { cause: err })
      // I can't put stuff on the error, the worker swallows it for some reason.
      report.errors.push({ error: buildError, errorData: { page } })
    }
  }

  return report
}
