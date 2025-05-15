export const vars = {
  title: 'API Example',
  // We don't need a client-side script for this route
  // but we could add one if needed
  layout: 'root' // Use the root layout
}

// You can use the method property to specify which HTTP method to handle
// If not provided, it defaults to GET
export const method = 'GET'

/**
 * Server route handler for the /api endpoint
 * This is processed server-side by Fastify
 * 
 * @param {import('fastify').FastifyRequest} request - The Fastify request object
 * @param {import('fastify').FastifyReply} reply - The Fastify reply object
 */
export default async function apiRoute(request, reply) {
  // For HTML responses, just return a string
  return `
    <h1>API Example</h1>
    
    <p>This is a server-side route powered by Fastify and DomStack.</p>
    
    <p>Unlike static pages that are generated at build time, this page is processed
    for each request, allowing for dynamic content and server-side logic.</p>
    
    <div class="api-example">
      <h2>Current Server Time</h2>
      <p>The server time is: <strong>${new Date().toLocaleString()}</strong></p>
      <p>This time is generated on the server for each request.</p>
    </div>
    
    <h2>JSON API Endpoint</h2>
    <p>For a JSON response, check out the <a href="/api/hello">API hello endpoint</a>.</p>
    
    <p>
      <a href="/" class="button">Back to Home</a>
    </p>
  `;
  
  // For JSON responses, you could do:
  // return { message: 'This is a server-side route' };
  
  // Or you can use reply directly for more control:
  // reply.code(200).send({ message: 'This is a server-side route' });
}