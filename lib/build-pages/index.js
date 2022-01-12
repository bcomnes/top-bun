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

    worker.once('message', results => {
      if (results.errors.length > 0) {
        // Put the errorData on the error to be consistent with the rest of the builders.
        results.errors = results.errors.map(({ error, errorData }) => {
          for (const [key, val] of Object.entries(errorData)) {
            error[key] = val
          }
          return error
        })
      }
      resolve(results)
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
  const results = {
    type: 'page',
    success: [],
    errors: [],
    warnings: []
  }

  const [
    globalVars,
    rootLayout
  ] = await Promise.allSettled([
    resolveVars(siteData?.globalVars?.filepath),
    resolveLayout(siteData?.rootLayout?.filepath)
  ])

  if (globalVars.status === 'rejected') {
    results.errors.push(new Error('Encountered an error when resolving globalVars', {
      cause: globalVars.reason
    }))
  }

  if (rootLayout.status === 'rejected') {
    results.errors.push(new Error('Encountered an error when resolving rootLayout', {
      cause: rootLayout.reason
    }))
  }

  if (results.errors.length > 0) return results // Return early, these will all fail.

  for (const page of siteData.pages) {
    try {
      const builder = pageBuilders[page.type]
      // This should never happen
      if (!builder) throw new Error(`Can't build ${page.path}. unimplemented type ${page.type}`)

      // Supplement global vars with some global styles and clients
      globalVars.value.styles = siteData.globalStyle ? ['/global.css'] : []
      globalVars.value.scripts = siteData.globalClient ? ['/global.client.js'] : []

      const result = await builder({
        src,
        dest,
        page,
        globalVars: globalVars.value,
        rootLayout: rootLayout.value
      })
      results.success.push(result)
    } catch (err) {
      const buildError = new Error('Error building page', { cause: err })
      // I can't put stuff on the error, the worker swallows it for some reason.
      results.errors.push({ error: buildError, errorData: { page } })
    }
  }

  return results
}
