function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}

export const siteConfig = {
  name: "ResumeAI",
  fullName: "ResumeAI by SoftSync Lab",
  company: "SoftSync Lab",
  tagline: ["AI Resume Builder", "ATS Optimization", "Job Description Matching", "AI Rewriting"],
  description:
    "ResumeAI by SoftSync Lab: AI resume builder with ATS optimization, job description matching and AI rewriting. No fabricated facts, and your resume is never stored.",
  url: resolveSiteUrl(),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@softsyncsolutions.in",
  // Keep search engines out until launch: set NEXT_PUBLIC_ALLOW_INDEXING=true to go public.
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
}

/** Legal details used across the Privacy Policy, Terms, Cookie Policy and Contact page. */
export const legalConfig = {
  entity: "SoftSync Lab",
  address: "Bengaluru, Karnataka, India",
  jurisdiction: "Bengaluru, Karnataka",
  grievanceOfficer: { name: "Rohith P M", email: "contact@softsyncsolutions.in" },
  lastUpdated: "October 12, 2026",
}
