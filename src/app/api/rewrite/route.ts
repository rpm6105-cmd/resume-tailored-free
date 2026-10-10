import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/supabase-server"
import { rewriteSchema, getClientIp } from "@/lib/utils/guards"
import { hashIp } from "@/lib/utils/text"
import { getServerEnv } from "@/lib/utils/env"
import { getRateLimiter } from "@/lib/rate-limit/ratelimit"
import { SYSTEM_PROMPT, buildRewritePrompt } from "@/lib/ai/system-prompt"

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = rewriteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { resumeText, jobDescription, model } = parsed.data
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const env = getServerEnv()
    const ip = getClientIp(request)
    const ipHash = hashIp(ip)
    const limiter = getRateLimiter(env.RATE_LIMIT_PER_DAY, "24 h")
    const key = user?.id ? `user:${user.id}` : `ip:${ipHash}`
    const { success } = await limiter.limit(key)

    if (!success) {
      return NextResponse.json({ error: "Daily free limit reached (3/day). Try again tomorrow." }, { status: 429 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Resume Tailor Free",
      },
      body: JSON.stringify({
        model: model || env.OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildRewritePrompt(resumeText, jobDescription) },
        ],
        temperature: 0.25,
        max_tokens: 4096,
        top_p: 0.9,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: "AI request failed" }, { status: 500 })
    }

    const data = (await res.json()) as OpenRouterResponse
    const rewritten = data.choices?.[0]?.message?.content?.trim() || ""

    return NextResponse.json({ rewritten })
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 408 })
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
