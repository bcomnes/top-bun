console.log('Pages client script loaded!');

document.addEventListener('DOMContentLoaded', () => {
  const exampleDiv = document.querySelector('.example');
  
  if (exampleDiv) {
    // Add a highlight effect when clicking on the code example
    exampleDiv.addEventListener('click', () => {
      exampleDiv.classList.add('highlight');
      
      setTimeout(() => {
        exampleDiv.classList.remove('highlight');
      }, 500);
    });
    
    console.log('Example code block interactive elements initialized');
  }
  
  // Add timestamp to show when the page was loaded client-side
  const footer = document.querySelector('footer p');
  if (footer) {
    const timestamp = document.createElement('span');
    timestamp.textContent = ` • Page loaded at: ${new Date().toLocaleTimeString()}`;
    footer.appendChild(timestamp);
  }
});

// Add some simple styling
const style = document.createElement('style');
style.textContent = `
  .example {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 0;
    transition: background-color 0.3s;
  }
  
  .example.highlight {
    background-color: #fffde7;
  }
  
  .example pre {
    overflow-x: auto;
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);