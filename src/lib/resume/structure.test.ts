import { describe, expect, it } from "vitest"
import { isSectionHeading, parseResume, resumeFileBase, stripInlineMarkdown } from "./structure"
import { SAMPLE_RESUME } from "@/test/fixtures"

describe("isSectionHeading", () => {
  it.each(["SUMMARY", "Work Experience", "Skills:", "## Education", "**PROJECTS**", "Technical Expertise".toUpperCase()])("detects %s", (line) => {
    expect(isSectionHeading(line)).toBe(true)
  })
  it.each(["- Built APIs", "Go, Python, AWS", "Senior Engineer | Acme | 2021", "Languages: English, Hindi", "AWS"])("rejects %s", (line) => {
    expect(isSectionHeading(line)).toBe(false)
  })
})

describe("parseResume", () => {
  const blocks = parseResume(SAMPLE_RESUME)

  it("treats an all-caps first line as the name", () => {
    expect(blocks[0]).toEqual({ type: "name", text: "JANE DOE" })
    expect(blocks[1].type).toBe("contact")
  })

  it("finds every section heading", () => {
    expect(blocks.filter((b) => b.type === "heading").map((b) => b.text)).toEqual(["SUMMARY", "WORK EXPERIENCE", "SKILLS", "EDUCATION"])
  })

  it("marks role lines followed by bullets as subheadings", () => {
    const subs = blocks.filter((b) => b.type === "subheading").map((b) => b.text)
    expect(subs).toEqual(["Senior Software Engineer | Acme Pay | Remote | 2021 - Present", "Software Engineer | Globex | Austin, TX | 2018 - 2021"])
  })

  it("strips bullet markers", () => {
    expect(blocks.filter((b) => b.type === "bullet")).toHaveLength(3)
    expect(blocks.find((b) => b.type === "bullet")?.text).toMatch(/^Led migration/)
  })

  it("handles markdown-ish output", () => {
    const md = parseResume("# Jane Doe\n\n## Skills:\n* **Go**, Python\n```")
    expect(md).toEqual([
      { type: "name", text: "Jane Doe" },
      { type: "heading", text: "SKILLS" },
      { type: "bullet", text: "Go, Python" },
    ])
  })
})

describe("helpers", () => {
  it("strips inline markdown", () => {
    expect(stripInlineMarkdown("### **Bold** and `code`")).toBe("Bold and code")
  })
  it("builds a file name from the candidate name", () => {
    expect(resumeFileBase(parseResume(SAMPLE_RESUME))).toBe("JANE-DOE-Resume")
    expect(resumeFileBase([])).toBe("Tailored-Resume")
  })
})
