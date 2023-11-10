import tap from 'tap'
import desm from 'desm'
import { TopBun } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = desm(import.meta.url)

tap.test('build-errors', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new TopBun(src, dest)

  await rm(dest, { recursive: true, force: true })

  try {
    const results = await siteUp.build()
    t.notOk(results, 'Build should fail, and not generate results')
  } catch (err) {
    t.match(err.message, /Prebuild finished but there were errors/, 'Should have an error message about a filed build.')
    t.ok(Array.isArray(err.errors), 'Should have an array of errors')

    const esbuildErrors = err.errors.find(err => err.message.includes('Error building JS+CSS with esbuild'))

    t.ok(esbuildErrors, 'Should include a js client build error')
    t.ok(esbuildErrors.cause, 'Should include an error cause')
  }
})
