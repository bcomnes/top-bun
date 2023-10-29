import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = desm(import.meta.url)

tap.test('default-layout', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new Siteup(src, dest)

  await rm(dest, { recursive: true, force: true })

  await siteUp.build()

  t.ok('built with default layout')
})
