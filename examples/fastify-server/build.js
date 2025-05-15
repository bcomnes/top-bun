import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { DomStack } from '../../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function build() {
  console.log('Building site...')
  
  const src = join(__dirname, 'src')
  const dest = join(__dirname, 'dist')
  
  const domstack = new DomStack(src, dest, {
    static: true,
    buildDrafts: process.env.NODE_ENV !== 'production'
  })
  
  try {
    const buildResult = await domstack.build()
    
    if (buildResult.warnings?.length > 0) {
      console.warn(`DomStack build completed with ${buildResult.warnings.length} warnings:`)
      for (const warning of buildResult.warnings) {
        if ('message' in warning) {
          console.warn(`  ${warning.message}`)
        } else {
          console.warn(warning)
        }
      }
    }
    
    console.log(`Pages: ${buildResult.siteData.pages.length} Layouts: ${Object.keys(buildResult.siteData.layouts).length} Templates: ${buildResult.siteData.templates.length}`)
    console.log('Build completed successfully!')
  } catch (err) {
    console.error('Build failed:', err)
    process.exit(1)
  }
}

build()