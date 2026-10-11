import Anthropic from "@anthropic-ai/sdk"
import type { ServerEnv } from "@/lib/utils/env"
import { siteConfig } from "@/lib/site"

export const AI_TIMEOUT_MS = 55_000

export type GenerateResult =
  | { ok: true; text: string; provider: "anthropic" | "openrouter" }
  | { ok: false; reason: "truncated" | "refusal" | "timeout" | "provider"; status?: number; detail?: string }

type Prompt = { system: string; user: string }

/** Claude when ANTHROPIC_API_KEY is set, otherwise OpenRouter. */
export function generateText(env: ServerEnv, prompt: Prompt): Promise<GenerateResult> {
  if (env.ANTHROPIC_API_KEY) return generateWithAnthropic(env, prompt)
  return generateWithOpenRouter(env, prompt)
}

let anthropic: Anthropic | undefined

async function generateWithAnthropic(env: ServerEnv, { system, user }: Prompt): Promise<GenerateResult> {
  anthropic ??= new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, timeout: AI_TIMEOUT_MS, maxRetries: 1 })
  try {
    // Streaming keeps long rewrites clear of HTTP timeouts; we only need the final message.
    const message = await anthropic.messages
      .stream({
        model: env.ANTHROPIC_MODEL,
        max_tokens: 16000,
        system,
        messages: [{ role: "user", content: user }],
        output_config: { effort: env.ANTHROPIC_EFFORT },
      })
      .finalMessage()

    if (message.stop_reason === "refusal") {
      return { ok: false, reason: "refusal", detail: message.stop_details?.category ?? undefined }
    }
    if (message.stop_reason === "max_tokens" || message.stop_reason === "model_context_window_exceeded") {
      return { ok: false, reason: "truncated" }
    }
    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
    return { ok: true, text, provider: "anthropic" }
  } catch (e) {
    if (e instanceof Anthropic.APIConnectionTimeoutError) return { ok: false, reason: "timeout" }
    if (e instanceof Anthropic.APIError) return { ok: false, reason: "provider", status: e.status, detail: e.name }
    return { ok: false, reason: "provider", detail: e instanceof Error ? e.name : "unknown" }
  }
}

type OpenRouterResponse = {
  choices?: Array<{ finish_reason?: string; message?: { content?: string } }>
  error?: { message?: string; code?: number }
}

async function generateWithOpenRouter(env: ServerEnv, { system, user }: Prompt): Promise<GenerateResult> {
  if (!env.OPENROUTER_API_KEY) return { ok: false, reason: "provider", detail: "no AI provider configured" }
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
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.25,
        top_p: 0.9,
        max_tokens: 8000,
      }),
      signal: controller.signal,
    })
    const data = (await res.json().catch(() => ({}))) as OpenRouterResponse
    if (!res.ok || data.error) return { ok: false, reason: "provider", status: res.status }
    const choice = data.choices?.[0]
    if (choice?.finish_reason === "length") return { ok: false, reason: "truncated" }
    return { ok: true, text: choice?.message?.content ?? "", provider: "openrouter" }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") return { ok: false, reason: "timeout" }
    return { ok: false, reason: "provider", detail: e instanceof Error ? e.name : "unknown" }
  } finally {
    clearTimeout(timeout)
  }
}
