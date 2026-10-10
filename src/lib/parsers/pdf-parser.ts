import * as pdfjsLib from "pdfjs-dist"
import { itemsToLines } from "./pdf-lines"

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()
}

export async function parsePdf(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise
  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(itemsToLines(content.items).join("\n"))
  }
  await pdf.destroy()

  const normalized = pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim()
  if (!normalized) {
    throw new Error("This PDF does not contain selectable text")
  }
  return normalized
}
