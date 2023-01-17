
import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = desm(import.meta.url)

tap.test('nested-dest', async (t) => {
  const src = __dirname
  const dest = path.join(__dirname, './public')
  const cwd = __dirname
  const siteUp = new Siteup(src, dest, cwd)

  await rm(dest, { recursive: true })

  await siteUp.build()

  t.ok('built with default layout')
})
