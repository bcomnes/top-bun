import { toggleTheme } from 'mine.css'
import { foo } from './shared.js'

console.log(foo)

window.toggleTheme = toggleTheme

console.log('The global client is loaded on every page.')

// Try to keep this file as small as possible.
// Use if for things like global theme switchers or analytics scripts
