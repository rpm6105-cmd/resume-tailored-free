import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/auth/supabase-server"
import { safeNextPath } from "@/lib/utils/guards"

/**
 * Magic-link landing route. Handles both the PKCE `code` flow (default) and
 * the `token_hash` flow (works across devices when the Supabase email
 * template links to /auth/confirm?token_hash={{ .TokenHash }}&type=email).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = safeNextPath(searchParams.get("next"))
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  const supabase = await createClient()
  let ok = false

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    ok = !error
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    ok = !error
  }

  if (ok) return NextResponse.redirect(new URL(next, origin))
  return NextResponse.redirect(new URL(`/login?error=link&next=${encodeURIComponent(next)}`, origin))
}
