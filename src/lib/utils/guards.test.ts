import { describe, expect, it } from "vitest"
import { getClientIp, hashIp, rewriteSchema, safeNextPath } from "./guards"
import { isEmailAllowed } from "@/lib/auth/allowlist"

describe("safeNextPath", () => {
  it.each([
    ["/tailor", "/tailor"],
    ["/tailor?x=1", "/tailor?x=1"],
    ["//evil.com", "/tailor"],
    ["/\\evil.com", "/tailor"],
    ["https://evil.com", "/tailor"],
    [null, "/tailor"],
  ])("%s -> %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected)
  })
})

describe("rewriteSchema", () => {
  it("rejects a client-supplied model field silently and enforces lengths", () => {
    const ok = rewriteSchema.safeParse({ resumeText: "a".repeat(100), jobDescription: "b".repeat(50), model: "openai/gpt-5-pro" })
    expect(ok.success).toBe(true)
    expect(ok.success && "model" in ok.data).toBe(false)
    expect(rewriteSchema.safeParse({ resumeText: "short", jobDescription: "b".repeat(50) }).success).toBe(false)
  })
})

describe("ip helpers", () => {
  it("takes the first forwarded IP", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 10.0.0.1" } })
    expect(getClientIp(req)).toBe("1.2.3.4")
  })
  it("hashes deterministically without exposing the IP", () => {
    expect(hashIp("1.2.3.4", "s")).toBe(hashIp("1.2.3.4", "s"))
    expect(hashIp("1.2.3.4", "s")).not.toContain("1.2.3.4")
    expect(hashIp("1.2.3.4", "s")).not.toBe(hashIp("1.2.3.4", "t"))
  })
})

describe("isEmailAllowed", () => {
  it("allows everyone when the list is empty", () => {
    expect(isEmailAllowed("a@b.com", "")).toBe(true)
  })
  it("matches emails and domains case-insensitively", () => {
    const list = "Tester@Gmail.com, @softsync.in"
    expect(isEmailAllowed("tester@gmail.com", list)).toBe(true)
    expect(isEmailAllowed("someone@softsync.in", list)).toBe(true)
    expect(isEmailAllowed("other@gmail.com", list)).toBe(false)
    expect(isEmailAllowed(undefined, list)).toBe(false)
  })
})
