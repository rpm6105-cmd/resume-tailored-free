function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}

export const siteConfig = {
  name: "Resume Tailor",
  description: "Tailor your resume to a job description with AI. ATS-friendly output, no fabricated facts, and nothing stored.",
  url: resolveSiteUrl(),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  // Keep search engines out until launch: set NEXT_PUBLIC_ALLOW_INDEXING=true to go public.
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
}
