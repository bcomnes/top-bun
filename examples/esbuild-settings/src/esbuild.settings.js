import { polyfillNode } from 'esbuild-plugin-polyfill-node'

export default async function esbuildSettingsOverride (esbuildSettings) {
  esbuildSettings.plugins = [
    polyfillNode(),
  ]
  return esbuildSettings
}
