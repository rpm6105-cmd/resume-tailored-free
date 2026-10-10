import { z } from "zod"

const serverEnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_MODEL: z.string().optional().default("google/gemini-2.5-flash"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RATE_LIMIT_PER_DAY: z.coerce.number().int().positive().optional().default(3),
  MAX_FILE_MB: z.coerce.number().int().positive().optional().default(5),
})

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ")
    throw new Error(`Missing or invalid server env: ${missing}`)
  }
  return parsed.data
}
