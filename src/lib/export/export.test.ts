import { describe, expect, it } from "vitest"
import { Packer } from "docx"
import { buildResumePdf, toPdfSafeText } from "./pdf"
import { buildResumeDocx } from "./docx"
import { resumeToHtml } from "@/lib/utils/format-html"
import { SAMPLE_RESUME } from "@/test/fixtures"

async function extractPdfText(data: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data), isEvalSupported: false }).promise
  let text = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent()
    text += content.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n"
  }
  return text
}

describe("PDF export", () => {
  it("produces selectable text an ATS can read", async () => {
    const pdf = buildResumePdf(SAMPLE_RESUME)
    const text = await extractPdfText(pdf.output("arraybuffer"))
    for (const expected of ["JANE DOE", "WORK EXPERIENCE", "Acme Pay", "40%", "jane.doe@example.com", "PostgreSQL"]) {
      expect(text).toContain(expected)
    }
  })

  it("paginates long resumes", () => {
    const long = SAMPLE_RESUME + "\n" + Array.from({ length: 120 }, (_, i) => `- Achievement number ${i} described in a reasonably long sentence`).join("\n")
    expect(buildResumePdf(long).getNumberOfPages()).toBeGreaterThan(1)
  })

  it("normalizes typography outside the standard font", () => {
    expect(toPdfSafeText("“Led” – the team… ₹5L")).toBe('"Led" - the team... Rs.5L')
  })
})

describe("DOCX export", () => {
  it("builds a valid document", async () => {
    const buffer = await Packer.toBuffer(buildResumeDocx(SAMPLE_RESUME))
    expect(buffer.subarray(0, 2).toString()).toBe("PK")
  })
})

describe("print HTML", () => {
  it("groups bullets into lists and escapes content", () => {
    const html = resumeToHtml("Jane <Doe>\nSKILLS\n- Go\n- Python\nEDUCATION\nBS")
    expect(html).toContain("<h1>Jane &lt;Doe&gt;</h1>")
    expect(html).toContain("<ul><li>Go</li><li>Python</li></ul><h2>EDUCATION</h2>")
  })
})
