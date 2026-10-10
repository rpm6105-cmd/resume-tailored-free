import { createHash } from "node:crypto"
import { z } from "zod"
import { LIMITS } from "@/lib/limits"

export const rewriteSchema = z.object({
  resumeText: z.string().trim().min(LIMITS.resumeMin).max(LIMITS.resumeMax),
  jobDescription: z.string().trim().min(LIMITS.jdMin).max(LIMITS.jdMax),
})

export function getClientIp(req: Request): string {
  const h = req.headers
  const xff = h.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return h.get("x-real-ip") || h.get("cf-connecting-ip") || "0.0.0.0"
}

/** One-way hash so raw IPs never reach Redis. */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)
}

/** Only allow same-site relative redirects (blocks "//evil.com" and absolute URLs). */
export function safeNextPath(next: string | null | undefined, fallback = "/tailor"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback
  return next
}
