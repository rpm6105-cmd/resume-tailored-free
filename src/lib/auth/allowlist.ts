/** Splits a pasted allowlist into normalized entries, tolerating quotes, spaces, semicolons and newlines. */
export function parseAllowList(allowList: string): string[] {
  return allowList
    .split(/[,;\s]+/)
    .map((e) => e.trim().replace(/^["'<]+|["'>]+$/g, "").toLowerCase())
    .filter(Boolean)
}

/**
 * Invite-only beta gate. ALLOWED_EMAILS is a list of emails and/or domains
 * ("@company.com"). Empty means everyone may sign in.
 */
export function isEmailAllowed(email: string | null | undefined, allowList = process.env.ALLOWED_EMAILS ?? ""): boolean {
  const entries = parseAllowList(allowList)
  if (entries.length === 0) return true
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return entries.some((entry) => (entry.startsWith("@") ? normalized.endsWith(entry) : normalized === entry))
}
