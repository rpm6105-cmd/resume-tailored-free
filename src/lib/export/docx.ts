import { BorderStyle, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx"
import { parseResume, resumeFileBase } from "@/lib/resume/structure"

const FONT = "Arial"

export function buildResumeDocx(text: string): Document {
  const blocks = parseResume(text)
  const paragraphs: Paragraph[] = blocks.map((block) => {
    switch (block.type) {
      case "name":
        return new Paragraph({ children: [new TextRun({ text: block.text, bold: true, size: 34 })], spacing: { after: 60 } })
      case "contact":
        return new Paragraph({ children: [new TextRun({ text: block.text, size: 19 })], spacing: { after: 20 } })
      case "heading":
        return new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_2,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 1 } },
        })
      case "subheading":
        return new Paragraph({ children: [new TextRun({ text: block.text, bold: true })], spacing: { before: 120, after: 40 } })
      case "bullet":
        return new Paragraph({ children: [new TextRun(block.text)], bullet: { level: 0 }, spacing: { after: 40 } })
      case "text":
        return new Paragraph({ children: [new TextRun(block.text)], spacing: { after: 80 } })
    }
  })

  return new Document({
    creator: "Resume Tailor",
    title: "Resume",
    styles: {
      default: { document: { run: { font: FONT, size: 20 } } },
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: FONT, bold: true, size: 22, color: "000000" },
          paragraph: { spacing: { before: 240, after: 80 } },
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
        children: paragraphs,
      },
    ],
  })
}

export async function downloadDocx(text: string) {
  const blob = await Packer.toBlob(buildResumeDocx(text))
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${resumeFileBase(parseResume(text))}.docx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
