"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { createClient } from "@/lib/auth/supabase-server"
import { isEmailAllowed } from "@/lib/auth/allowlist"
import { safeNextPath } from "@/lib/utils/guards"

export type LoginState =
  | { status: "idle" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string; email?: string }
  | { status: "verified"; next: string }

const emailSchema = z.string().trim().toLowerCase().email()
const codeSchema = z.string().trim().regex(/^\d{6,8}$/)

const NOT_INVITED = "This beta is invite-only. Ask the owner to add your email to the tester list."

async function baseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

export async function requestMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailSchema.safeParse(formData.get("email"))
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." }
  const email = parsed.data
  if (!isEmailAllowed(email)) return { status: "error", message: NOT_INVITED, email }

  const next = safeNextPath(formData.get("next")?.toString())
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await baseUrl()}/auth/confirm?next=${encodeURIComponent(next)}` },
  })
  if (error) {
    const message = error.status === 429 ? "Too many sign-in emails. Please wait a few minutes and try again." : "Could not send the sign-in email. Please try again."
    return { status: "error", message, email }
  }
  return { status: "sent", email }
}

export async function verifyEmailCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = emailSchema.safeParse(formData.get("email"))
  const code = codeSchema.safeParse(formData.get("code"))
  if (!email.success) return { status: "error", message: "Enter a valid email address." }
  if (!code.success) return { status: "error", message: "Enter the code from your email.", email: email.data }
  if (!isEmailAllowed(email.data)) return { status: "error", message: NOT_INVITED, email: email.data }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ email: email.data, token: code.data, type: "email" })
  if (error) return { status: "error", message: "That code is invalid or expired. Request a new one.", email: email.data }
  return { status: "verified", next: safeNextPath(formData.get("next")?.toString()) }
}
