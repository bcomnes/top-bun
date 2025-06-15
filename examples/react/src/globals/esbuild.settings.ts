/**
 * Custom ESBuild Settings for React with TypeScript
 *
 * This file overrides the default DOMStack ESBuild configuration
 * to replace Preact with React for TSX transformation and runtime.
 */
import esbuild from 'esbuild'

// Use the BuildOptions type from esbuild
type BuildOptions = esbuild.BuildOptions

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

  // Enable TypeScript support
  esbuildSettings.loader = {
    ...esbuildSettings.loader,
    '.ts': 'ts',
    '.tsx': 'tsx'
  }

  // Define React-specific globals if needed
  esbuildSettings.define = {
    ...esbuildSettings.define,
    // Add any React-specific defines here if needed
  }

  // Add any React-specific plugins or customizations
  esbuildSettings.plugins = [
    ...(esbuildSettings.plugins || [])
    // Add any additional plugins here if needed
  ]

  return esbuildSettings
}
