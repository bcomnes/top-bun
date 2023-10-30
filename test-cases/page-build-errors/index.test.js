import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = desm(import.meta.url)

tap.test('build-errors', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new Siteup(src, dest)

  await rm(dest, { recursive: true, force: true })

  try {
    const results = await siteUp.build()
    t.notOk(results, 'Build should fail, and not generate results')
  } catch (err) {
    t.match(err.message, /Build finished but there were errors/, 'Should have an error message about a filed build.')
    t.ok(Array.isArray(err.errors), 'Should have an array of errors')

    const pageResolveError = err.errors.find(err => err.message.includes('Error resolving page vars'))

    t.ok(pageResolveError, 'Should include a page resolve build error')
    t.ok(pageResolveError.cause, 'Should include an error cause')
  }
})
