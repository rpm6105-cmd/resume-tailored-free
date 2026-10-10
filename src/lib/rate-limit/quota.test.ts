import { describe, expect, it } from "vitest"
import { MemoryStore, consumeQuota, nextUtcMidnight, peekQuota } from "./quota"

const now = new Date("2026-10-10T15:30:00Z")
const rules = (userLimit = 3, ipLimit = 10) => [
  { scope: "user" as const, id: "u1", limit: userLimit },
  { scope: "ip" as const, id: "ip1", limit: ipLimit },
]

describe("consumeQuota", () => {
  it("counts down and blocks after the user limit", async () => {
    const store = new MemoryStore()
    const results = []
    for (let i = 0; i < 4; i++) results.push(await consumeQuota(rules(), store, now))
    expect(results.map((r) => (r.ok ? r.remaining : "blocked"))).toEqual([2, 1, 0, "blocked"])
    const blocked = results[3]
    expect(!blocked.ok && blocked.scope).toBe("user")
  })

  it("refunds a failed attempt", async () => {
    const store = new MemoryStore()
    const first = await consumeQuota(rules(1), store, now)
    if (!first.ok) throw new Error("expected ok")
    await first.refund()
    expect((await consumeQuota(rules(1), store, now)).ok).toBe(true)
  })

  it("blocks on the IP rule without charging the user", async () => {
    const store = new MemoryStore()
    await consumeQuota([{ scope: "user", id: "a", limit: 5 }, { scope: "ip", id: "shared", limit: 1 }], store, now)
    const second = await consumeQuota([{ scope: "user", id: "b", limit: 5 }, { scope: "ip", id: "shared", limit: 1 }], store, now)
    expect(second.ok).toBe(false)
    expect(!second.ok && second.scope).toBe("ip")
    expect((await peekQuota({ scope: "user", id: "b", limit: 5 }, store, now)).remaining).toBe(5)
  })

  it("uses separate windows per UTC day", async () => {
    const store = new MemoryStore()
    await consumeQuota(rules(1), store, now)
    expect((await consumeQuota(rules(1), store, now)).ok).toBe(false)
    expect((await consumeQuota(rules(1), store, new Date("2026-10-11T00:00:01Z"))).ok).toBe(true)
  })

  it("resets at the next UTC midnight", () => {
    expect(nextUtcMidnight(now).toISOString()).toBe("2026-10-11T00:00:00.000Z")
  })
})
