import { afterEach, describe, expect, it, vi } from "vitest"
import { getServerEnv } from "./env"

afterEach(() => vi.unstubAllEnvs())

describe("getServerEnv", () => {
  it("defaults to Claude Haiku 5.5 at medium effort when an Anthropic key is set", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test")
    vi.stubEnv("OPENROUTER_API_KEY", "")
    const env = getServerEnv()
    expect(env.ANTHROPIC_MODEL).toBe("claude-haiku-5-5")
    expect(env.ANTHROPIC_EFFORT).toBe("medium")
  })

  it("requires at least one AI provider key", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "")
    vi.stubEnv("OPENROUTER_API_KEY", "")
    expect(() => getServerEnv()).toThrow(/ANTHROPIC_API_KEY/)
  })

  it("rejects an invalid effort level", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test")
    vi.stubEnv("ANTHROPIC_EFFORT", "turbo")
    expect(() => getServerEnv()).toThrow(/ANTHROPIC_EFFORT/)
  })
})
