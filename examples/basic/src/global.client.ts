// @ts-expect-error
import { toggleTheme } from 'mine.css'

declare global {
  interface Window {
    toggleTheme: typeof toggleTheme;
  }
}

window.toggleTheme = toggleTheme

console.log('The global client is loaded on every page.')

// Try to keep this file as small as possible.
// Use if for things like global theme switchers or analytics scripts
