import tap from 'tap'
import { TopBun } from '../../index.js'
import * as path from 'path'
import { rm } from 'fs/promises'

const __dirname = import.meta.dirname

tap.test('nested-dest', async (t) => {
  const src = __dirname
  const dest = path.join(__dirname, './public')
  const siteUp = new TopBun(src, dest, {
    copy: [
      path.join(__dirname, './copydir')
    ]
  })

  await rm(dest, { recursive: true, force: true })

  await siteUp.build()

  t.ok('built with default layout')
})
