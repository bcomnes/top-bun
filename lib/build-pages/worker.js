import { parentPort, workerData } from 'worker_threads'
import { buildPages } from './index.js'

async function run () {
  const { src, dest, siteData } = workerData
  const results = await buildPages(src, dest, siteData)
  parentPort.postMessage(results)
}

run()
