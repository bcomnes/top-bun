import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

export async function pageBuilder ({
  src,
  dest,
  page,
  pages
}) {
  const pageDir = join(dest, page.page.path)
  const pageFile = join(pageDir, page.page.outputName)

  const formattedPageOutput = await page.renderFullPage({ pages })

  await mkdir(pageDir, { recursive: true })
  await writeFile(pageFile, formattedPageOutput)

  return { page: pageFile }
}
