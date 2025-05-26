import { test } from 'node:test'
import assert from 'node:assert'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

test.describe('nested-dest', () => {
  test('should build site with nested destination', async () => {
    const src = __dirname
    const dest = path.join(__dirname, './public')
    const siteUp = new DomStack(src, dest, {
      copy: [
        path.join(__dirname, './copydir')
      ]
    })

    await rm(dest, { recursive: true, force: true })

    await siteUp.build()

    assert.ok(true, 'built with default layout')
  })
})
