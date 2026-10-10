import * as pdfjsLib from "pdfjs-dist"

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()
}

export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map((item: unknown) => {
      const it = item as { str?: string }
      return it.str || ""
    })
    text += strings.join(" ") + "\n"
  }
  const normalized = text.replace(/\s+\n/g, "\n").replace(/\n{2,}/g, "\n").trim()

  if (!normalized) {
    throw new Error("This PDF does not contain selectable text")
  }

  return normalized
}
