import tap from 'tap'
import desm from 'desm'
import { resolve } from 'node:path'

import { resolveVars } from './resolve-vars'

const __dirname = desm(import.meta.url)

tap.test('resolve vars resolves vars', async (t) => {
  const varsFile = resolve(__dirname, '../../test-project/src/global.vars.js')

  const vars = resolveVars(varsFile)

  t.equal(vars.foo, 'global')
})
