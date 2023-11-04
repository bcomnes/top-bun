import tap from 'tap'
import desm from 'desm'
import { resolve } from 'path'

import { resolveVars } from './resolve-vars.js'

const __dirname = desm(import.meta.url)

tap.test('resolve vars resolves vars', async (t) => {
  const varsPath = resolve(__dirname, '../../test-cases/general-features/src/global.vars.js')

  const vars = await resolveVars({ varsPath })

  // @ts-ignore
  t.equal(vars.foo, 'global')
})
