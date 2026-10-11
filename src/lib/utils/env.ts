import { z } from "zod"

// Treat blank env values (e.g. `KEY=`) as unset so optional/defaulted fields behave.
const blankToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v)

const envObject = z
  .object({
    // AI provider: Claude is used when ANTHROPIC_API_KEY is set, otherwise OpenRouter.
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    ANTHROPIC_MODEL: z.string().min(1).optional().default("claude-haiku-5-5"),
    ANTHROPIC_EFFORT: z.enum(["low", "medium", "high", "xhigh", "max"]).optional().default("medium"),
    OPENROUTER_API_KEY: z.string().min(1).optional(),
    OPENROUTER_MODEL: z.string().min(1).optional().default("google/gemini-2.5-flash"),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    RATE_LIMIT_PER_DAY: z.coerce.number().int().positive().optional().default(3),
    RATE_LIMIT_PER_IP_PER_DAY: z.coerce.number().int().positive().optional().default(10),
    IP_HASH_SALT: z.string().optional().default("resume-tailor"),
    ALLOWED_EMAILS: z.string().optional().default(""),
  })
  .refine((env) => env.ANTHROPIC_API_KEY || env.OPENROUTER_API_KEY, {
    message: "Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY",
    path: ["ANTHROPIC_API_KEY"],
  })

const serverEnvSchema = z.preprocess(
  (env) => Object.fromEntries(Object.entries(env as Record<string, unknown>).map(([k, v]) => [k, blankToUndefined(v)])),
  envObject
)

export type ServerEnv = z.infer<typeof serverEnvSchema>

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ")
    throw new Error(`Missing or invalid server env: ${missing}`)
  }
  return parsed.data
}
