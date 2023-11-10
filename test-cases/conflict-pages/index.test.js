import tap from 'tap'
import desm from 'desm'
import { TopBun } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = desm(import.meta.url)

tap.test('conflict-pages', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new TopBun(src, dest)

  await rm(dest, { recursive: true, force: true })

  t.rejects(siteUp.build(), /Page walk finished but there were errors/, 'Throws when conflicting page is found on build.')
})
