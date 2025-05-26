import { test } from 'node:test'
import assert from 'node:assert'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

test('default-layout', async () => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new DomStack(src, dest)

  await rm(dest, { recursive: true, force: true })

  await siteUp.build()

  assert.ok(true, 'built with default layout')
})
