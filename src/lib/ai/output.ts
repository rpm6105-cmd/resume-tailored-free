/** Cleans common model artifacts (code fences, chatty preambles) from the rewrite. */
export function cleanModelOutput(raw: string): string {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((l) => !/^\s*```/.test(l))
  while (lines.length && !lines[0].trim()) lines.shift()
  if (lines.length > 1 && /^(here('s| is| are)|sure\b|certainly\b|below is)/i.test(lines[0].trim())) {
    lines.shift()
  }
  const last = lines.at(-1)?.trim() ?? ""
  if (lines.length > 1 && /^(note:|i hope|let me know|feel free)/i.test(last)) {
    lines.pop()
  }
  return lines.join("\n").trim()
}

export type OutputProblem = "empty" | "too_short"

export function validateRewrite(rewritten: string, original: string): OutputProblem | null {
  if (!rewritten) return "empty"
  // A real rewrite keeps most of the content; a tiny reply is a refusal or failure.
  if (rewritten.length < Math.min(200, original.length * 0.3)) return "too_short"
  return null
}

const NUMBER_RE = /[$€£₹]?\d[\d,.]*\s?(%|k|m|bn|\+)?/gi
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s|)]+|\blinkedin\.com\/[^\s|)]+/gi

function normalizeToken(t: string) {
  return t.toLowerCase().replace(/[,\s]/g, "").replace(/[.)]+$/, "")
}

/**
 * Flags numbers, emails and links in the rewrite that don't appear in the
 * original, which are likely fabrications the user should double-check.
 */
export function findUnverifiedFacts(original: string, rewritten: string): string[] {
  const originalNorm = normalizeToken(original)
  const found = new Set<string>()
  for (const re of [NUMBER_RE, EMAIL_RE, URL_RE]) {
    for (const match of rewritten.matchAll(re)) {
      const token = match[0].trim().replace(/[.,;:]+$/, "")
      const norm = normalizeToken(token)
      // Skip single digits; they're usually list numbering or noise.
      if (norm.replace(/\D/g, "").length < 2 && re === NUMBER_RE) continue
      if (!originalNorm.includes(norm)) found.add(token)
    }
  }
  return [...found].slice(0, 12)
}
