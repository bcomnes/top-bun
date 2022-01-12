import { parentPort, workerData } from 'worker_threads'
import { buildPagesDirect } from './index.js'

async function run () {
  const { src, dest, siteData } = workerData
  const results = await buildPagesDirect(src, dest, siteData)
  parentPort.postMessage(results)
}

run()
