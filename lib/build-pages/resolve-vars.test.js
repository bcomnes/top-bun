import tap from 'tap'
import { resolve } from 'path'

import { resolveVars } from './resolve-vars.js'

const __dirname = import.meta.dirname

tap.test('resolve vars resolves vars', async (t) => {
  const varsPath = resolve(__dirname, '../../test-cases/general-features/src/globals/global.vars.js')

  const vars = await resolveVars({ varsPath })

  // @ts-ignore
  t.equal(vars.foo, 'global')
})
