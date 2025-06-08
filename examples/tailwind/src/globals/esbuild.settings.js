/**
 * Tailwind CSS Integration for DOMStack
 *
 * This file configures ESBuild to process Tailwind CSS in your project.
 * It enables utility-first CSS classes that can be used directly in your HTML and components.
 */
import tailwindPlugin from 'esbuild-plugin-tailwindcss'

/**
 * Configure ESBuild settings to include Tailwind CSS processing
 *
 * @param {import('esbuild').BuildOptions} esbuildSettings - The default ESBuild configuration
 * @return {Promise<import('esbuild').BuildOptions>} - The modified ESBuild configuration
 */
export default async function esbuildSettingsOverride (esbuildSettings) {
  // Add the Tailwind plugin to the ESBuild configuration
  esbuildSettings.plugins = [
    tailwindPlugin({
      // You can add Tailwind plugin options here if needed
      // Example: tailwindConfig: './custom-tailwind.config.js'
    }),
  ]

  // You can also add other ESBuild settings as needed
  // esbuildSettings.minify = true;
  // esbuildSettings.sourcemap = true;

  return esbuildSettings
}
