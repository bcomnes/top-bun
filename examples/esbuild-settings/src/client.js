/**
 * ESBuild Node.js Polyfill Example
 *
 * This file demonstrates how we can use Node.js built-in modules
 * in browser-side JavaScript when proper ESBuild settings are configured.
 */

// Import Node.js built-in modules
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

// Log a welcome message
console.log('===== Node.js Modules in Browser Demo =====')

// Demonstrate OS module functionality
console.log('\n📊 OS Module Info:')
console.log('- Platform:', os.platform())
console.log('- Architecture:', os.arch())
console.log('- CPUs:', os.cpus().length)
console.log('- Total Memory:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB')
console.log('- Free Memory:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB')

// Demonstrate Path module functionality
console.log('\n🗂️ Path Module Example:')
const filePath = '/users/documents/file.txt'
console.log('- Original path:', filePath)
console.log('- Directory name:', path.dirname(filePath))
console.log('- Base name:', path.basename(filePath))
console.log('- Extension:', path.extname(filePath))
console.log('- Parsed:', path.parse(filePath))

// Demonstrate Process module functionality
console.log('\n⚙️ Process Info:')
console.log('- Current working directory:', process.cwd())
console.log('- Process platform:', process.platform)
console.log('- Node.js version:', process.version)

console.log('\n✅ All of these Node.js APIs work in the browser thanks to ESBuild polyfills!')
