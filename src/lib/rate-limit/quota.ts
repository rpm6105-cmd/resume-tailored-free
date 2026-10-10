import { Redis } from "@upstash/redis"

/**
 * Daily quota with fixed UTC-day windows. Unlike a sliding-window limiter,
 * a consumed unit can be refunded when the AI call fails, and the reset
 * time is predictable for users ("resets at midnight UTC").
 */

export interface QuotaStore {
  incr(key: string, ttlSeconds: number): Promise<number>
  decr(key: string): Promise<void>
  get(key: string): Promise<number>
}

class RedisStore implements QuotaStore {
  constructor(private redis: Redis) {}
  async incr(key: string, ttlSeconds: number) {
    const [count] = await this.redis.pipeline().incr(key).expire(key, ttlSeconds).exec<[number, number]>()
    return count
  }
  async decr(key: string) {
    await this.redis.decr(key)
  }
  async get(key: string) {
    return Number((await this.redis.get<number>(key)) ?? 0)
  }
}

export class MemoryStore implements QuotaStore {
  private data = new Map<string, { count: number; expires: number }>()
  private live(key: string) {
    const entry = this.data.get(key)
    if (entry && entry.expires < Date.now()) {
      this.data.delete(key)
      return undefined
    }
    return entry
  }
  async incr(key: string, ttlSeconds: number) {
    const entry = this.live(key) ?? { count: 0, expires: Date.now() + ttlSeconds * 1000 }
    entry.count += 1
    this.data.set(key, entry)
    return entry.count
  }
  async decr(key: string) {
    const entry = this.live(key)
    if (entry) entry.count = Math.max(0, entry.count - 1)
  }
  async get(key: string) {
    return this.live(key)?.count ?? 0
  }
}

let store: QuotaStore | undefined

export function getQuotaStore(): QuotaStore {
  if (store) return store
  // Vercel Marketplace's Upstash integration injects KV_REST_API_* names.
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (url && token) {
    store = new RedisStore(new Redis({ url, token }))
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Upstash Redis env (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN) is required in production")
  } else {
    console.warn("[quota] Upstash not configured; using in-memory quota (dev only)")
    store = new MemoryStore()
  }
  return store
}

export function utcDay(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function nextUtcMidnight(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
}

const TTL_SECONDS = 60 * 60 * 26

export type QuotaRule = { scope: "user" | "ip"; id: string; limit: number }

export type ConsumeResult =
  | { ok: true; remaining: number; limit: number; resetAt: string; refund: () => Promise<void> }
  | { ok: false; scope: QuotaRule["scope"]; limit: number; resetAt: string }

function keyFor(rule: QuotaRule, day: string) {
  return `quota:${rule.scope}:${rule.id}:${day}`
}

/** Consumes one unit from every rule atomically-enough: rolls back all if any is over limit. */
export async function consumeQuota(rules: QuotaRule[], s: QuotaStore = getQuotaStore(), now = new Date()): Promise<ConsumeResult> {
  const day = utcDay(now)
  const resetAt = nextUtcMidnight(now).toISOString()
  const taken: string[] = []
  let primaryCount = 0

  for (const rule of rules) {
    const key = keyFor(rule, day)
    const count = await s.incr(key, TTL_SECONDS)
    taken.push(key)
    if (count > rule.limit) {
      await Promise.all(taken.map((k) => s.decr(k)))
      return { ok: false, scope: rule.scope, limit: rule.limit, resetAt }
    }
    if (rule === rules[0]) primaryCount = count
  }

  return {
    ok: true,
    remaining: Math.max(0, rules[0].limit - primaryCount),
    limit: rules[0].limit,
    resetAt,
    refund: async () => {
      await Promise.all(taken.map((k) => s.decr(k)))
    },
  }
}

export async function peekQuota(rule: QuotaRule, s: QuotaStore = getQuotaStore(), now = new Date()) {
  const used = await s.get(keyFor(rule, utcDay(now)))
  return { remaining: Math.max(0, rule.limit - used), limit: rule.limit, resetAt: nextUtcMidnight(now).toISOString() }
}
