import { parseResume } from "@/lib/resume/structure"

/** Standalone, print-ready HTML document for the resume. */
export function resumeToHtml(text: string): string {
  const blocks = parseResume(text)
  let body = ""
  let inList = false

  for (const block of blocks) {
    if (block.type !== "bullet" && inList) {
      body += "</ul>"
      inList = false
    }
    const t = escapeHtml(block.text)
    switch (block.type) {
      case "name":
        body += `<h1>${t}</h1>`
        break
      case "contact":
        body += `<p class="contact">${t}</p>`
        break
      case "heading":
        body += `<h2>${t}</h2>`
        break
      case "subheading":
        body += `<h3>${t}</h3>`
        break
      case "bullet":
        if (!inList) {
          body += "<ul>"
          inList = true
        }
        body += `<li>${t}</li>`
        break
      case "text":
        body += `<p>${t}</p>`
        break
    }
  }
  if (inList) body += "</ul>"

  const title = escapeHtml(blocks.find((b) => b.type === "name")?.text ?? "Resume")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>
@page { size: A4; margin: 0.75in; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.4; color: #000; margin: 0; }
h1 { font-size: 18pt; margin: 0 0 4px; }
h2 { font-size: 11pt; margin: 14px 0 6px; padding-bottom: 2px; border-bottom: 1px solid #999; text-transform: uppercase; }
h3 { font-size: 10.5pt; margin: 8px 0 2px; }
p { margin: 2px 0 4px; }
.contact { font-size: 9.5pt; margin: 0; }
ul { margin: 2px 0 6px; padding-left: 18px; }
li { margin: 0 0 2px; }
h2, h3 { break-after: avoid; }
li { break-inside: avoid; }
</style></head><body>${body}</body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
