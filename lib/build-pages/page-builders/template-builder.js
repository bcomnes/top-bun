import { join, resolve, dirname } from 'path'
import { writeFile, mkdir } from 'fs/promises'

export async function templateBuilder ({
  src,
  dest,
  globalVars,
  template,
  pages
}) {
  const { default: renderTemplate } = await import(template.template.filepath)

  if (!renderTemplate) throw new Error(`Missing default export from template file: ${template.template.relname}`)

  const finalVars = {
    vars: globalVars,
    pages,
    template
  }

  const templateResults = await renderTemplate(finalVars)

  const fileDir = join(dest, template.path)
  const filePath = join(fileDir, template.outputName)

  if (typeof templateResults[Symbol.asyncIterator] === 'function') {
    for await (const templateResult of templateResults) {
      if ('outputName' in templateResult && 'content' in templateResult) {
        const filePathOverride = resolve(fileDir, templateResult.outputName)
        const filePathOverrideDirname = dirname(filePathOverride)
        await mkdir(filePathOverrideDirname, { recursive: true })
        await writeFile(filePathOverride, templateResult.content)
      } else {
        throw new Error(`Template file returned unknown return type: ${typeof templateResult}`)
      }
    }
  } else if (
    typeof templateResults === 'object' &&
    'outputName' in templateResults &&
    'content' in templateResults
  ) {
    const filePathOverride = resolve(fileDir, templateResults.outputName)
    const filePathOverrideDirname = dirname(filePathOverride)
    await mkdir(filePathOverrideDirname, { recursive: true })
    await writeFile(filePathOverride, templateResults.content)
  } else if (
    Array.isArray(templateResults) &&
    templateResults.every(item => 'outputName' in item && 'content' in item)
  ) {
    for (const templateResult of templateResults) {
      const filePathOverride = resolve(fileDir, templateResult.outputName)
      const filePathOverrideDirname = dirname(filePathOverride)
      await mkdir(filePathOverrideDirname, { recursive: true })
      await writeFile(filePathOverride, templateResult.content)
    }
  } else if (typeof templateResults === 'string') {
    await mkdir(fileDir, { recursive: true })
    await writeFile(filePath, templateResults)
  } else {
    throw new Error(`Template file returned unknown return type: ${typeof templateResults}`)
  }

  return { template: 'todo' }
}
