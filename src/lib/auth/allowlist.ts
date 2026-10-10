/**
 * Invite-only beta gate. ALLOWED_EMAILS is a comma-separated list of emails
 * and/or domains ("@company.com"). Empty means everyone may sign in.
 */
export function isEmailAllowed(email: string | null | undefined, allowList = process.env.ALLOWED_EMAILS ?? ""): boolean {
  const entries = allowList
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (entries.length === 0) return true
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return entries.some((entry) => (entry.startsWith("@") ? normalized.endsWith(entry) : normalized === entry))
}
