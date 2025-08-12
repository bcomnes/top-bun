// Client-side script for the home page
// This script adds some dynamic elements to the home page

document.addEventListener('DOMContentLoaded', () => {
  // Add a status indicator to show if the browser supports web workers
  const supportsWorkers = typeof Worker !== 'undefined'

  // Create the status element
  const statusContainer = document.createElement('div')
  statusContainer.className = 'worker-status'
  statusContainer.innerHTML = `
    <h3>Web Worker Support</h3>
    <div class="status ${supportsWorkers ? 'supported' : 'unsupported'}">
      <span class="status-icon">${supportsWorkers ? '✓' : '✗'}</span>
      <span class="status-text">
        ${supportsWorkers
          ? 'Your browser supports Web Workers!'
          : 'Your browser does not support Web Workers'}
      </span>
    </div>
    ${supportsWorkers
      ? '<p>You can run all the examples in this demo.</p>'
      : '<p>You need a modern browser to run these examples.</p>'}
  `

  // Insert the status after the first section
  const firstSection = document.querySelector('h2')
  if (firstSection && firstSection.parentNode) {
    firstSection.parentNode.insertBefore(statusContainer, firstSection.nextSibling)
  }

  // Add a little animation for page links
  document.querySelectorAll('a[href="/worker-page/"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.innerHTML = 'Web Worker Example <span class="link-icon">→</span>'
    })

    link.addEventListener('mouseleave', () => {
      link.innerHTML = 'Web Worker Example'
    })
  })

  // Add some styles for our dynamic elements
  const style = document.createElement('style')
  style.textContent = `
    .worker-status {
      margin: 2rem 0;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
    }
    
    .worker-status h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    .status {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .status-icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 50%;
      margin-right: 10px;
      font-weight: bold;
    }
    
    .supported .status-icon {
      background-color: #28a745;
      color: white;
    }
    
    .unsupported .status-icon {
      background-color: #dc3545;
      color: white;
    }
    
    .status-text {
      font-weight: bold;
    }
    
    .supported .status-text {
      color: #28a745;
    }
    
    .unsupported .status-text {
      color: #dc3545;
    }
    
    .link-icon {
      display: inline-block;
      transition: transform 0.2s;
      margin-left: 5px;
    }
    
    a:hover .link-icon {
      transform: translateX(3px);
    }
  `

  document.head.appendChild(style)
})
