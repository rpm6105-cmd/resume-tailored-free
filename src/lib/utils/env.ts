import { z } from "zod"

const serverEnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_MODEL: z.string().min(1).optional().default("google/gemini-2.5-flash"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  RATE_LIMIT_PER_DAY: z.coerce.number().int().positive().optional().default(3),
  RATE_LIMIT_PER_IP_PER_DAY: z.coerce.number().int().positive().optional().default(10),
  IP_HASH_SALT: z.string().optional().default("resume-tailor"),
  ALLOWED_EMAILS: z.string().optional().default(""),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ")
    throw new Error(`Missing or invalid server env: ${missing}`)
  }
  return parsed.data
}
