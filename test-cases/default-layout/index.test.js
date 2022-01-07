import tap from 'tap'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

const __dirname = desm(import.meta.url)
const rimrafP = promisify(rimraf)

tap.test('default-layout', async (t) => {
  const src = path.join(__dirname, './src')
  const dest = path.join(__dirname, './public')
  const cwd = __dirname
  const siteUp = new Siteup(src, dest, cwd)

  await rimrafP(dest)

  await siteUp.build()

  t.ok('built with default layout')
})
