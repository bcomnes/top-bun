/** @import { BuildOptions } from 'esbuild' */
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

/**
 * @param  {BuildOptions} esbuildSettings
 * @return {Promise<BuildOptions>}
 */
export default async function esbuildSettingsOverride (esbuildSettings) {
  esbuildSettings.plugins = [
    polyfillNode(),
  ]
  return esbuildSettings
}
