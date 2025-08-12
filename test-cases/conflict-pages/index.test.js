import { test } from 'node:test'
import assert from 'node:assert'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

test.describe('conflict-pages', () => {
  test('should throw error when conflicting pages are found', async () => {
    const src = path.join(__dirname, './src')
    const dest = path.join(__dirname, './public')
    const siteUp = new DomStack(src, dest)

    await rm(dest, { recursive: true, force: true })

    await assert.rejects(siteUp.build(), /Page walk finished but there were errors/, 'Throws when conflicting page is found on build.')
  })
})
