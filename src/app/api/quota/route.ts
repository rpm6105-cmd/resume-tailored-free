import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/supabase-server"
import { isEmailAllowed } from "@/lib/auth/allowlist"
import { getServerEnv } from "@/lib/utils/env"
import { peekQuota } from "@/lib/rate-limit/quota"

const noStore = { headers: { "Cache-Control": "no-store" } }

/** Lets the workspace show sign-in state and remaining rewrites before tailoring. */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ signedIn: false }, noStore)

  try {
    const env = getServerEnv()
    const allowed = isEmailAllowed(user.email, env.ALLOWED_EMAILS)
    const quota = await peekQuota({ scope: "user", id: user.id, limit: env.RATE_LIMIT_PER_DAY })
    return NextResponse.json({ signedIn: true, allowed, ...quota }, noStore)
  } catch {
    return NextResponse.json({ signedIn: true, allowed: true }, noStore)
  }
}
