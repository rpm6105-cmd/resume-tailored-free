// Referenced literally so Next.js inlines them into the browser bundle.
// Newer Supabase projects (and the Vercel integration) may provide a
// "publishable" key instead of the legacy "anon" key; both work.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
