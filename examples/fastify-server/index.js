import Fastify from 'fastify'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import fastifyDomstack from '../../plugins/fastify-domstack.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create Fastify instance
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
})

// Register the domstack plugin
await fastify.register(fastifyDomstack, {
  src: join(__dirname, 'src'),
  dest: join(__dirname, 'dist'),
  watch: process.env.NODE_ENV !== 'production',
  domstackOpts: {
    buildDrafts: process.env.NODE_ENV !== 'production'
  }
})

// Add a custom API route
fastify.get('/api/hello', async () => {
  return { hello: 'world' }
})

// Start the server
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
  console.log('Server is running at http://localhost:3000')
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}