import tap from 'tap'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

tap.test('default-layout', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new DomStack(src, dest)

  await rm(dest, { recursive: true, force: true })

  await siteUp.build()

  t.ok('built with default layout')
})
