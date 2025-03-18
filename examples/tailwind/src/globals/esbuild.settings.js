import tailwindPlugin from 'esbuild-plugin-tailwindcss'

export default async function esbuildSettingsOverride (esbuildSettings) {
  esbuildSettings.plugins = [
    tailwindPlugin(),
  ]
  return esbuildSettings
}
