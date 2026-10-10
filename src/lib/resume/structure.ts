export type ResumeBlock =
  | { type: "name"; text: string }
  | { type: "contact"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "bullet"; text: string }
  | { type: "text"; text: string }

const SECTION_NAMES = new Set([
  "summary",
  "professional summary",
  "career summary",
  "profile",
  "professional profile",
  "objective",
  "career objective",
  "experience",
  "work experience",
  "professional experience",
  "relevant experience",
  "employment history",
  "work history",
  "education",
  "education and training",
  "skills",
  "technical skills",
  "key skills",
  "core skills",
  "core competencies",
  "competencies",
  "projects",
  "key projects",
  "personal projects",
  "certifications",
  "certificates",
  "licenses and certifications",
  "awards",
  "honors and awards",
  "achievements",
  "accomplishments",
  "publications",
  "languages",
  "volunteer experience",
  "volunteering",
  "interests",
  "training",
  "courses",
  "references",
  "additional information",
  "other",
])

const BULLET_RE = /^\s*[-*•▪◦●‣–]\s+/

/** Removes markdown the model sometimes emits despite instructions. */
export function stripInlineMarkdown(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .trim()
}

function normalizeHeadingCandidate(line: string): string {
  return stripInlineMarkdown(line)
    .replace(/[:\s]+$/, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .toLowerCase()
}

export function isSectionHeading(line: string): boolean {
  const raw = line.trim()
  if (!raw || BULLET_RE.test(raw)) return false
  const normalized = normalizeHeadingCandidate(raw)
  if (SECTION_NAMES.has(normalized)) return true

  // Short ALL-CAPS lines with no list punctuation read as headings ("TECHNICAL EXPERTISE").
  const cleaned = stripInlineMarkdown(raw).replace(/:$/, "")
  const letters = cleaned.replace(/[^A-Za-z]/g, "")
  const words = cleaned.split(/\s+/).length
  return (
    // Single short words like "AWS" or "SQL" are usually skills, not headings.
    (words > 1 ? letters.length >= 4 : letters.length >= 5) &&
    cleaned.length <= 40 &&
    words <= 5 &&
    !/[,|@\d]/.test(cleaned) &&
    letters === letters.toUpperCase()
  )
}

/** Turns plain resume text into typed blocks shared by every exporter. */
export function parseResume(text: string): ResumeBlock[] {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^```/.test(l) && !/^[-=_*]{3,}$/.test(l))

  const blocks: ResumeBlock[] = []
  let seenHeading = false

  for (const line of lines) {
    const awaitingName = !seenHeading && !blocks.some((b) => b.type === "name")
    // An ALL-CAPS first line ("JANE DOE") is the name, not a heading.
    const heading = awaitingName ? SECTION_NAMES.has(normalizeHeadingCandidate(line)) : isSectionHeading(line)
    if (heading) {
      seenHeading = true
      blocks.push({ type: "heading", text: normalizeDisplayHeading(line) })
      continue
    }
    if (BULLET_RE.test(line)) {
      blocks.push({ type: "bullet", text: stripInlineMarkdown(line.replace(BULLET_RE, "")) })
      continue
    }
    const clean = stripInlineMarkdown(line)
    if (!seenHeading) {
      if (awaitingName && clean.length <= 60 && !/[@|]/.test(clean)) {
        blocks.push({ type: "name", text: clean })
      } else {
        blocks.push({ type: "contact", text: clean })
      }
      continue
    }
    blocks.push({ type: "text", text: clean })
  }

  // A short line directly followed by bullets is a role/project title line.
  for (let i = 0; i < blocks.length - 1; i++) {
    const b = blocks[i]
    if (b.type === "text" && b.text.length <= 140 && blocks[i + 1].type === "bullet") {
      blocks[i] = { type: "subheading", text: b.text }
    }
  }

  return blocks
}

function normalizeDisplayHeading(line: string): string {
  return stripInlineMarkdown(line).replace(/:$/, "").trim().toUpperCase()
}

/** Suggested download name based on the candidate's name, e.g. "Jane-Doe-Resume". */
export function resumeFileBase(blocks: ResumeBlock[]): string {
  const name = blocks.find((b) => b.type === "name")?.text ?? ""
  const slug = name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join("-")
  return slug ? `${slug}-Resume` : "Tailored-Resume"
}
