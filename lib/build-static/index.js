// @ts-ignore
import cpx from 'cpx2'
const copy = cpx.copy

/**
 * @typedef {Awaited<ReturnType<typeof copy>>} StaticBuilderReport
 */

/**
 * @typedef {import('../builder.js').BuildStepResult<'static', StaticBuilderReport>} StaticBuildStepResult
 */

/**
 * @typedef {import('../builder.js').BuildStep<'static', StaticBuilderReport>} StaticBuildStep
 */

/**
 * @param  {string} src - The base path to the copy glob
 * @return {string}     - The copy clob
 */
export function getCopyGlob (src) {
  // Always ignore files we typically process. Otherwise it gets really confusing.
  return `${src}/**/!(*.ts|*.mts|*.cts|*.js|*.cjs|*.mjs|*.css|*.html|*.md)`
}

/**
 * run CPX2 on src folder
 *
 * @type {StaticBuildStep}
 */
export async function buildStatic (src, dest, _siteData, opts) {
  /** @type {StaticBuildStepResult} */
  const results = {
    type: 'static',
    report: {},
    errors: [],
    warnings: [],
  }

  try {
    const report = await copy(getCopyGlob(src), dest, { ignore: opts?.ignore })
    results.report = report
  } catch (err) {
    const buildError = new Error('Error copying static files', { cause: err })
    results.errors.push(buildError)
  }

  return results
}
