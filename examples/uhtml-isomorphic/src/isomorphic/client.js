import { html, render } from 'uhtml-isomorphic'

// Simple counter state
let counter = 0

// Function to update counter display
function updateCounter() {
  const counterElement = document.querySelector('.counter-value')
  if (counterElement) {
    counterElement.textContent = counter
  }
}

// Initialize client-side interactivity
function initializeCounter() {
  const incrementButton = document.querySelector('.increment-button')
  const decrementButton = document.querySelector('.decrement-button')
  
  if (incrementButton) {
    incrementButton.addEventListener('click', () => {
      counter++
      updateCounter()
    })
  }
  
  if (decrementButton) {
    decrementButton.addEventListener('click', () => {
      counter--
      updateCounter()
    })
  }
}

// Hydrate the component when in browser
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  window.addEventListener('DOMContentLoaded', () => {
    // Initialize counter interactivity
    initializeCounter()
    
    console.log('uhtml-isomorphic component hydrated!')
  })
}
