import { test } from 'node:test'
import assert from 'node:assert'
import { getCopyDirs } from './index.js'

test.describe('build-copy', () => {
  test('getCopyDirs returns correct src/dest pairs', async () => {
    const copyDirs = getCopyDirs(['fixtures'])

    assert.deepStrictEqual(copyDirs, ['fixtures/**'])
  })
})
