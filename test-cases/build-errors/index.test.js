import { test } from 'node:test'
import assert from 'node:assert'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

test.describe('build-errors', () => {
  test('should handle build errors correctly', async () => {
    const src = path.join(__dirname, './src')
    const dest = path.join(__dirname, './public')
    const siteUp = new DomStack(src, dest)

    await rm(dest, { recursive: true, force: true })

    try {
      const results = await siteUp.build()
      assert.ok(!results, 'Build should fail, and not generate results')
    } catch (err) {
      assert.match(err.message, /Prebuild finished but there were errors/, 'Should have an error message about a filed build.')
      assert.ok(Array.isArray(err.errors), 'Should have an array of errors')

      const esbuildErrors = err.errors.find(err => err.message.includes('Error building JS+CSS with esbuild'))

      assert.ok(esbuildErrors, 'Should include a js client build error')
      assert.ok(esbuildErrors.cause, 'Should include an error cause')
    }
  })
})
