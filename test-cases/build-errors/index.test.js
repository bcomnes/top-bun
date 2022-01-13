import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

const __dirname = desm(import.meta.url)
const rimrafP = promisify(rimraf)

tap.test('build-errors', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const cwd = __dirname
  const siteUp = new Siteup(src, dest, cwd)

  await rimrafP(dest)

  try {
    const results = await siteUp.build()
    t.notOk(results, 'Build should fail, and not generate results')
  } catch (err) {
    t.match(err.message, /Build finished but there were errors/, 'Should have an error message about a filed build.')
    t.ok(Array.isArray(err.errors), 'Should have an array of errors')

    const pageError = err.errors.find(err => err.message.includes('Error building page'))
    const cssError = err.errors.find(err => err.message.includes('Error building css'))
    const jsError = err.errors.find(err => err.message.includes('Error building JS clients'))

    t.ok(pageError, 'Should include a page build error')
    t.ok(pageError.cause, 'Should include an error cause')
    t.ok(cssError, 'Should include a css build error')
    t.ok(cssError.cause, 'Should include an error cause')
    t.ok(jsError, 'Should include a js client build error')
    t.ok(jsError.cause, 'Should include an error cause')
  }
})
