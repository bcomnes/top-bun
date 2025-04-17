// @ts-ignore
import cpx from 'cpx2'
import { join } from 'node:path'
const copy = cpx.copy

/**
 * @typedef {Awaited<ReturnType<typeof copy>>} CopyBuilderReport
 */

/**
 * @typedef {import('../builder.js').BuildStepResult<'static', CopyBuilderReport>} CopyBuildStepResult
 */

/**
 * @typedef {import('../builder.js').BuildStep<'static', CopyBuilderReport>} CopyBuildStep
 */

/**
 * @param  {string[]} copy
 * @return {string[]}
 */
export function getCopyDirs (copy = []) {
  const copyGlobs = copy?.map((dir) => join(dir, '**'))
  return copyGlobs
}

/**
 * run CPX2 on src folder
 *
 * @type {CopyBuildStep}
 */
export async function buildCopy (_src, dest, _siteData, opts) {
  /** @type {CopyBuildStepResult} */
  const results = {
    type: 'static',
    report: {},
    errors: [],
    warnings: [],
  }

  const copyDirs = getCopyDirs(opts?.copy)

  const copyTasks = copyDirs.map((copyDir) => {
    return copy(copyDir, dest)
  })

  const settled = await Promise.allSettled(copyTasks)

  for (const [index, result] of Object.entries(settled)) {
    // @ts-expect-error
    const copyDir = copyDirs[index]
    if (result.status === 'rejected') {
      const buildError = new Error('Error copying copy folders', { cause: result.reason })
      results.errors.push(buildError)
    } else {
      results.report[copyDir] = result.value
    }
  }
  return results
}
