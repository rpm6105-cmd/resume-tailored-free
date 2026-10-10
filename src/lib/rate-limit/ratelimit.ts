import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export function getRateLimiter(limit: number, window: string = "24 h") {
  const redis = Redis.fromEnv()
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window as unknown as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: false,
  })
}
