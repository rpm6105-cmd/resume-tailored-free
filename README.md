# Free AI Resume Tailor

Privacy-first resume rewriter. ATS-friendly. No resume storage.

## Privacy by design
- All parsing and PDF/DOCX generation happen in the browser
- Files are never uploaded to the server
- Resume text and job description are never persisted (DB, storage, logs, localStorage)
- Only minimal request metadata is logged

## Tech stack
- Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui
- @supabase/ssr (auth)
- pdf.js, mammoth.js (parsing)
- html2pdf.js, docx (export)
- OpenRouter, Upstash Redis + Ratelimit

## Setup
1. Copy .env.example to .env.local and fill values
2. Supabase: create project, enable Auth (Email/Magic Link/OTP). Set redirect URL http://localhost:3000/tailor
3. Upstash: create Redis, get REST URL/TOKEN
4. OpenRouter: create API key

## Dev
```bash
pnpm i
pnpm dev
```

## Build
```bash
pnpm build
pnpm start
```

## Test
- Upload a small .pdf/.docx/.txt and paste JD
- Click "Tailor with AI" (login required)
- Download PDF/DOCX or "Print to PDF"
- Check Network tab: no file upload body

## Vercel
Add all env vars from .env.example
