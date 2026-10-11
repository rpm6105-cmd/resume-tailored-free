import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/supabase-server"
import { isEmailAllowed } from "@/lib/auth/allowlist"
import { rewriteSchema, getClientIp, hashIp } from "@/lib/utils/guards"
import { getServerEnv } from "@/lib/utils/env"
import { consumeQuota } from "@/lib/rate-limit/quota"
import { SYSTEM_PROMPT, buildRewritePrompt } from "@/lib/ai/system-prompt"
import { cleanModelOutput, findUnverifiedFacts, validateRewrite } from "@/lib/ai/output"
import { siteConfig } from "@/lib/site"

export const maxDuration = 60

const AI_TIMEOUT_MS = 55_000

type OpenRouterResponse = {
  choices?: Array<{
    finish_reason?: string
    message?: { content?: string }
  }>
  error?: { message?: string; code?: number }
}

function errorResponse(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status, headers: { "Cache-Control": "no-store" } })
}

// Never log resume or job description content: only status metadata.
function logFailure(reason: string, meta: Record<string, unknown> = {}) {
  console.error(`[rewrite] ${reason}`, meta)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse("Invalid request body", 400)
  }

  const parsed = rewriteSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse("Resume must be 100–20,000 characters and the job description 50–10,000 characters.", 400)
  }
  const { resumeText, jobDescription } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return errorResponse("Please sign in to use the AI rewrite.", 401)
  }

  let env
  try {
    env = getServerEnv()
  } catch (e) {
    logFailure("server misconfigured", { message: e instanceof Error ? e.message : "unknown" })
    return errorResponse("The service is not configured correctly. Please try again later.", 500)
  }

  if (!isEmailAllowed(user.email, env.ALLOWED_EMAILS)) {
    return errorResponse("This beta is invite-only and your email is not on the list yet.", 403)
  }

  const quota = await consumeQuota([
    { scope: "user", id: user.id, limit: env.RATE_LIMIT_PER_DAY },
    { scope: "ip", id: hashIp(getClientIp(request), env.IP_HASH_SALT), limit: env.RATE_LIMIT_PER_IP_PER_DAY },
  ]).catch((e: unknown) => {
    logFailure("quota store error", { message: e instanceof Error ? e.message : "unknown" })
    return null
  })
  if (!quota) {
    return errorResponse("We could not check your usage right now. Please try again shortly.", 503)
  }
  if (!quota.ok) {
    const message =
      quota.scope === "user"
        ? `You've used all ${quota.limit} free rewrites for today. Your limit resets at midnight UTC.`
        : "Too many rewrites from this network today. Please try again tomorrow."
    return errorResponse(message, 429, { resetAt: quota.resetAt })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteConfig.url,
        "X-Title": siteConfig.fullName,
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildRewritePrompt(resumeText, jobDescription) },
        ],
        temperature: 0.25,
        top_p: 0.9,
        max_tokens: 8000,
      }),
      signal: controller.signal,
    })

    const data = (await res.json().catch(() => ({}))) as OpenRouterResponse
    if (!res.ok || data.error) {
      await quota.refund()
      logFailure("provider error", { status: res.status, code: data.error?.code })
      return errorResponse("The AI service is busy right now. Your free credit was not used. Please try again.", 502)
    }

    const choice = data.choices?.[0]
    if (choice?.finish_reason === "length") {
      await quota.refund()
      logFailure("output truncated")
      return errorResponse("The rewrite was cut off because the resume is very long. Try trimming older roles and retry.", 422)
    }

    const rewritten = cleanModelOutput(choice?.message?.content ?? "")
    const problem = validateRewrite(rewritten, resumeText)
    if (problem) {
      await quota.refund()
      logFailure("invalid output", { problem })
      return errorResponse("The AI returned an unusable result. Your free credit was not used. Please try again.", 502)
    }

    return NextResponse.json(
      {
        rewritten,
        warnings: findUnverifiedFacts(resumeText, rewritten),
        quota: { remaining: quota.remaining, limit: quota.limit, resetAt: quota.resetAt },
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (e) {
    await quota.refund()
    if (e instanceof Error && e.name === "AbortError") {
      logFailure("timeout")
      return errorResponse("The AI took too long to respond. Your free credit was not used. Please try again.", 504)
    }
    logFailure("unexpected", { name: e instanceof Error ? e.name : "unknown" })
    return errorResponse("Something went wrong. Your free credit was not used. Please try again.", 500)
  } finally {
    clearTimeout(timeout)
  }
}
