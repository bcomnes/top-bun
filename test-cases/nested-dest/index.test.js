import tap from 'tap'
import desm from 'desm'
import { TopBun } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = desm(import.meta.url)

tap.test('nested-dest', async (t) => {
  const src = __dirname
  const dest = path.join(__dirname, './public')
  const siteUp = new TopBun(src, dest)

  await rm(dest, { recursive: true, force: true })

  await siteUp.build()

  t.ok('built with default layout')
})
