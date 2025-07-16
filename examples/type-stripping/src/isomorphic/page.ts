import { page } from './client.ts'

// This demonstrates the isomorphic nature of the application:
// - In server context: renders the initial HTML
// - In browser context: hydrates with interactive functionality
export default () => {
  return page()
}
