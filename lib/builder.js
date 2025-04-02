import { buildPages } from './build-pages/index.js'
import { identifyPages } from './identify-pages.js'
import { buildStatic } from './build-static/index.js'
import { buildEsbuild } from './build-esbuild/index.js'
import { TopBunAggregateError } from './helpers/top-bun-aggregate-error.js'
import { ensureDest } from './helpers/ensure-dest.js'

/**
 * @typedef {import('esbuild').Message} EsbuildMessage
 * @typedef {import('./helpers/top-bun-warning.js').TopBunWarning} TopBunWarning
 */

/**
 * @typedef {Array<Error | EsbuildMessage>} BuildStepErrors
 * @typedef {Array<EsbuildMessage | TopBunWarning>} BuildStepWarnings
 */

/**
 * @template T, R
 * @typedef BuildStepResult
 * @property {T} type - Identifier for the type of build step.
 * @property {BuildStepErrors} errors - Any errors that occurred during the build step.
 * @property {BuildStepWarnings} warnings - Any warnings that occurred during the build step.
 * @property {R} report - A property whose structure is defined by the caller.
 */

/**
 * @template T, R
 * @callback BuildStep
 *
 * A function that represents a step in the build process. All build steps should
 * conform to this interface for consistency.
 *
 * @param {string} src - The source directory from which the site should be built.
 * @param {string} dest - The destination directory where the built site should be placed.
 * @param {SiteData} siteData - Data related to the site being built.
 * @param {TopBunOpts?} opts - Additional options for the build step.
 * @returns {Promise<BuildStepResult<T, R>>} - The results of the build step.
 */

/**
 * @typedef TopBunOpts
 * @property {string[]|undefined} [ignore] - Array of file/folder patterns to ignore.
 * @property {boolean|undefined} [static=true] - Enable/disable static file processing
 * @property {boolean|undefined} [metafile=true] - Enable/disable the writing of the esbuild metadata file.
 * @property {string[]|undefined} [ignore=[]] - Array of ignore strings
 * @property {string[]|undefined} [target=[]] - Array of target strings to pass to esbuild
 * @property {boolean|undefined} [buildDrafts=false] - Build draft files with the published:false variable
 */

/**
 * The data generated about the site generate dby identifyPages
 * @typedef {Awaited<ReturnType<identifyPages>>} SiteData
 */

/**
 * @typedef {import('./build-esbuild/index.js').EsBuildStepResults} EsBuildStepResults
 * @typedef {import('./build-pages/index.js').PageBuildStepResult} PageBuildStepResult
 * @typedef {import('./build-static/index.js').StaticBuildStepResult} StaticBuildStepResult
 */

/**
 * @typedef Results
 * @property {SiteData} siteData
 * @property {EsBuildStepResults} esbuildResults
 * @property {StaticBuildStepResult} [staticResults]
 * @property {PageBuildStepResult} [pageBuildResults]
 * @property {BuildStepWarnings} warnings
 */

/**
 * Builds a top-bun site from src to dest with a few options.
 *
 *
 * @async
 * @function
 * @export
 * @param {string} src - The source directory from which the site should be built.
 * @param {string} dest - The destination directory where the built site should be placed.
 * @param {TopBunOpts} opts - Options for the build process.
 * @returns Results
 *
 * @example
 *
 * const buildOptions = {
 *   static: true
 * };
 *
 * try {
 *   const buildResults = await builder('./src', './dist', { static: true })
 *   console.log(buildResults)
 * } catch (error) {
 *   console.error(error)
 * }
 */
export async function builder (src, dest, opts) {
  const errors = [] /** @type {BuildStepErrors} */
  const warnings = [] /** @type {BuildStepWarnings} */

  const siteData = await identifyPages(src, opts) /** @type {SiteData} */

  errors.push(...siteData.errors)
  warnings.push(...siteData.warnings)

  if (siteData.errors.length > 0) {
    const pageWalkErrors = new TopBunAggregateError(siteData.errors, 'Page walk finished but there were errors.', siteData)
    throw pageWalkErrors
  }

  await ensureDest(dest, siteData)

  const [
    esbuildResults,
    staticResults,
  ] = await Promise.all([
    buildEsbuild(src, dest, siteData, opts),
    opts.static
      ? buildStatic(src, dest, siteData, opts)
      : Promise.resolve(),
  ])

  /** @type {Results} */
  const results = {
    warnings,
    siteData,
    esbuildResults,
  }

  errors.push(...esbuildResults.errors)
  warnings.push(...esbuildResults.warnings)

  if (staticResults) {
    errors.push(...staticResults.errors)
    warnings.push(...staticResults.warnings)
    results.staticResults = staticResults
  }

  if (errors.length > 0) {
    const preBuildError = new TopBunAggregateError(errors, 'Prebuild finished but there were errors.', results)
    throw preBuildError
  }

  const pageBuildResults = await buildPages(src, dest, siteData, opts)

  errors.push(...pageBuildResults.errors)
  warnings.push(...pageBuildResults.warnings)
  results.pageBuildResults = pageBuildResults

  if (errors.length > 0) {
    const buildError = new TopBunAggregateError(errors, 'Build finished but there were errors.', results)
    throw buildError
  } else {
    return results
  }
}
