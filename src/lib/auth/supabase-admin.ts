import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let admin: SupabaseClient | null | undefined

/**
 * Service-role client for trusted server work (quota counters). Never import
 * from client code: the key bypasses row-level security.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  admin = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null
  return admin
}
