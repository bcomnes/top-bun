// The global.vars.js file should export default either an object, function that
// returns an object or an async function that returns an object.
//
// These variables are available to every page, and have the lowest precedence.

export default async function () {
  return {
    siteName: 'siteup basic'
  }
}
