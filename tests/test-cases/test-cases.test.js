import test from 'brittle'
import desm from 'desm'
import { Siteup } from '../../index.js'
import * as path from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

const __dirname = desm(import.meta.url)
const rimrafP = promisify(rimraf)

test('general-features', async (t) => {
  const src = path.join(__dirname, './general-features/src')
  const dest = path.join(__dirname, './general-features/public')
  const cwd = path.join(__dirname, './general-features')
  const siteUp = new Siteup(src, dest, cwd)

  await rimrafP(dest)

  const results = await siteUp.build()

  // console.log(results)
  t.ok(results)
})
