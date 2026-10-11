import { jsPDF } from "jspdf"
import { parseResume, resumeFileBase } from "@/lib/resume/structure"

// Standard PDF fonts only cover WinAnsi; map common typography to safe equivalents.
export function toPdfSafeText(s: string): string {
  return s
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”‟]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/[   ]/g, " ")
    .replace(/₹/g, "Rs.")
    .replace(/[​-‍﻿]/g, "")
}

const PAGE = { margin: 54 }
const FONT = "helvetica"
const SIZES = { name: 18, contact: 9.5, heading: 11, subheading: 10.5, body: 10 }
const LEADING = 1.35

/** Builds a real text-based PDF (selectable, ATS-parseable), not a screenshot. */
export function buildResumePdf(text: string): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PAGE.margin * 2
  let y = PAGE.margin

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - PAGE.margin) {
      doc.addPage()
      y = PAGE.margin
    }
  }

  const writeWrapped = (value: string, size: number, x: number, width: number) => {
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(toPdfSafeText(value), width) as string[]
    const lineHeight = size * LEADING
    for (const line of lines) {
      ensureSpace(lineHeight)
      doc.text(line, x, y, { baseline: "top" })
      y += lineHeight
    }
  }

  const blocks = parseResume(text)
  blocks.forEach((block, i) => {
    switch (block.type) {
      case "name":
        doc.setFont(FONT, "bold")
        writeWrapped(block.text, SIZES.name, PAGE.margin, contentWidth)
        y += 2
        break
      case "contact":
        doc.setFont(FONT, "normal")
        writeWrapped(block.text, SIZES.contact, PAGE.margin, contentWidth)
        break
      case "heading": {
        y += i === 0 ? 0 : 10
        ensureSpace(SIZES.heading * LEADING + 24)
        doc.setFont(FONT, "bold")
        writeWrapped(block.text, SIZES.heading, PAGE.margin, contentWidth)
        doc.setDrawColor(150)
        doc.setLineWidth(0.6)
        doc.line(PAGE.margin, y, pageWidth - PAGE.margin, y)
        y += 5
        break
      }
      case "subheading":
        y += 4
        ensureSpace(SIZES.subheading * LEADING * 2)
        doc.setFont(FONT, "bold")
        writeWrapped(block.text, SIZES.subheading, PAGE.margin, contentWidth)
        break
      case "bullet": {
        doc.setFont(FONT, "normal")
        doc.setFontSize(SIZES.body)
        ensureSpace(SIZES.body * LEADING)
        doc.text("•", PAGE.margin + 2, y, { baseline: "top" })
        writeWrapped(block.text, SIZES.body, PAGE.margin + 14, contentWidth - 14)
        y += 1.5
        break
      }
      case "text":
        doc.setFont(FONT, "normal")
        writeWrapped(block.text, SIZES.body, PAGE.margin, contentWidth)
        y += 2
        break
    }
  })

  const name = blocks.find((b) => b.type === "name")?.text
  doc.setProperties({ title: name ? `${toPdfSafeText(name)} - Resume` : "Resume", creator: "ResumeAI by SoftSync Lab" })
  return doc
}

export function downloadPdf(text: string) {
  const doc = buildResumePdf(text)
  doc.save(`${resumeFileBase(parseResume(text))}.pdf`)
}
