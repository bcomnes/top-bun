import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * @param  {string} source
 * @param  {string} target
 */
export async function copyFile (source, target) {
  // Extract the directory part of the target path
  const targetDir = path.dirname(target)

  // Ensure the target directory exists
  await fs.mkdir(targetDir, { recursive: true })

  // Copy the file
  await fs.copyFile(source, target)
}
