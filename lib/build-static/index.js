import cpx from 'cpx2'
const copy = cpx.copy

export function getCopyGlob (src) {
  // TODO: make this customizeable?
  return `${src}/**/!(*.js|*.css|*.html|*.md)`
}

/**
 * run CPX2 on src folder
 */
export async function buildStatic (src, dest, siteData, opts = {}) {
  const results = {
    type: 'static',
    report: null,
    errors: [],
    warnings: []
  }

  const args = [getCopyGlob(src), dest, { ignore: opts.ignore }]

  try {
    const report = await copy(...args)
    results.report = report
  } catch (err) {
    const buildError = new Error('Error copying static files', { cause: err })
    buildError.staticArgs = args
    results.errors.push(buildError)
  }

  return results
}
