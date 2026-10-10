import { z } from "zod"

export const rewriteSchema = z.object({
  resumeText: z.string().min(100).max(20000),
  jobDescription: z.string().min(50).max(10000),
  model: z.string().optional(),
})

export function getClientIp(req: Request): string {
  const h = req.headers
  const xff = h.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  const cf = h.get("cf-connecting-ip")
  if (cf) return cf
  const xr = h.get("x-real-ip")
  if (xr) return xr
  return "0.0.0.0"
}
