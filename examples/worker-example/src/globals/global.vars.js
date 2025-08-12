// global.vars.js file exports default variables that are available to all pages
// These have the lowest precedence in the variable resolution order

export default {
  siteName: 'DOMStack Web Workers',
  description: 'Examples of using Web Workers with DOMStack',
  author: 'DOMStack Team',
  defaultLayout: 'root'
}

// Alternatively, you can use an async function that returns an object:
// export default async function() {
//   return {
//     siteName: 'DOMStack Web Workers',
//     description: 'Examples of using Web Workers with DOMStack',
//     author: 'DOMStack Team',
//     defaultLayout: 'root'
//   }
// }

// The browser variable is special and is exposed to client JS
export const browser = {
  environment: 'browser',
  features: {
    webWorkers: 'available'
  }
}
