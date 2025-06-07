/**
 * ESBuild Settings Override
 * 
 * This file demonstrates how to customize the ESBuild configuration in DOMStack.
 * It allows Node.js built-in modules to be used in browser-side JavaScript by
 * applying polyfills through the esbuild-plugin-polyfill-node plugin.
 * 
 * @import { BuildOptions } from 'esbuild'
 */
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

/**
 * Configure ESBuild settings for browser-compatible Node.js modules
 * 
 * This function receives the default ESBuild configuration and returns a
 * modified version with additional plugins and settings.
 * 
 * @param  {BuildOptions} esbuildSettings - The default ESBuild configuration
 * @return {Promise<BuildOptions>} - The modified ESBuild configuration
 */
export default async function esbuildSettingsOverride (esbuildSettings) {
  // Add the Node.js polyfill plugin to enable using Node.js modules in the browser
  esbuildSettings.plugins = [
    polyfillNode({
      // You can configure specific polyfills here if needed
      // For example: include: ['os', 'path', 'fs']
    }),
  ]
  
  // You can also modify other ESBuild settings:
  // esbuildSettings.minify = true;
  // esbuildSettings.sourcemap = true;
  
  return esbuildSettings
}
