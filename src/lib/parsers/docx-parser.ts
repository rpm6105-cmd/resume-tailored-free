import mammoth from "mammoth"

export async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.replace(/\r\n/g, "\n").trim()
}
