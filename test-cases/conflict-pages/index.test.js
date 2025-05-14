import tap from 'tap'
import { DomStack } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

tap.test('conflict-pages', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const siteUp = new DomStack(src, dest)

  await rm(dest, { recursive: true, force: true })

  t.rejects(siteUp.build(), /Page walk finished but there were errors/, 'Throws when conflicting page is found on build.')
})
