import { mkdir } from 'fs/promises'
import { join } from 'path'

/**
 * @typedef {import('../builder.js').SiteData} SiteData
 */

/**
 * Create folders for each page.
 *
 * @async
 * @function
 * @param {string} dest - The destination directory where folders will be created.
 * @param {SiteData} siteData - An object containing an array of pages, each having a path where a folder should be created.
 * @returns {Promise<void>} - A promise that resolves when all directories have been created.
 */
export async function ensureDest (dest, siteData) {
  await mkdir(dest, { recursive: true })

  for (const page of siteData.pages) {
    await mkdir(join(dest, page.path), { recursive: true })
  }
}
