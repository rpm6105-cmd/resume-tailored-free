import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

export async function downloadDocx(text: string, filename = "tailored-resume.docx") {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const isBullet = /^[-*•]\s+/.test(trimmed)
    const isHeading = /^(summary|work experience|experience|education|skills|projects|certifications|other):/i.test(trimmed)
    if (isHeading) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/:$/, ""),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      )
      continue
    }
    paragraphs.push(
      new Paragraph({
        children: [new TextRun(isBullet ? trimmed.replace(/^[-*•]\s+/, "") : trimmed)],
        bullet: isBullet ? { level: 0 } : undefined,
        spacing: { line: 276 },
      })
    )
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
