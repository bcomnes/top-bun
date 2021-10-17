import test from 'brittle'
import desm from 'desm'
import { resolve } from 'node:path'

import { resolveVars } from './resolve-vars.js'

const __dirname = desm(import.meta.url)

test('resolve vars resolves vars', async (t) => {
  const varsFile = resolve(__dirname, '../../test-project/src/global.vars.js')

  const vars = await resolveVars(varsFile)

  t.is(vars.foo, 'global')
})
