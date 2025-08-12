/**
 * Custom ESBuild Settings for React with TypeScript
 *
 * This file overrides the default DOMStack ESBuild configuration
 * to replace Preact with React for TSX transformation and runtime.
 */
import type { BuildOptions } from 'esbuild'

/**
 * Configure ESBuild settings for React with TypeScript support
 *
 * @param esbuildSettings - The default ESBuild configuration
 * @returns The modified ESBuild configuration
 */
export default async function esbuildSettingsOverride(esbuildSettings: BuildOptions): Promise<BuildOptions> {
  // Override the JSX settings to use React instead of Preact
  esbuildSettings.jsx = 'automatic'
  esbuildSettings.jsxImportSource = 'react'

  return esbuildSettings
}
