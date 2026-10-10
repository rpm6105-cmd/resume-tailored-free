# Privacy-First Resume Tailor – Opencode Build Prompt

Build a production-ready, privacy-first "Free Resume Tailor" web app from scratch with the exact requirements below.

## 1) CORE GOAL

- Users upload a resume (.PDF, .DOCX, .TXT) OR paste resume text + paste a Job Description (JD)
- AI rewrites to be ATS-friendly (stronger bullets, action verbs, keyword alignment) without fabricating any facts
- Output clean, downloadable file (PDF + DOCX). Also "Print to PDF" fallback
- NO resume file, resume text, or job description must be saved to DB, object storage, filesystem, logs, localStorage, sessionStorage or IndexedDB
- Keep only in React memory. Discard on refresh/unmount
- Anonymous preview allowed. Require login ONLY at "Tailor with AI" to generate
- Send ONLY extracted plain text + JD to API

## 2) TECH STACK

- Next.js 15 (App Router), TypeScript strict
- Tailwind CSS + shadcn/ui
- @supabase/ssr for auth (magic link/email OTP)
- pdf.js, mammoth.js (client parsing)
- html2pdf.js, docx (client export)
- OpenRouter API (default: google/gemini-2.5-flash)
- @upstash/redis + @upstash/ratelimit (IP + userId)
- zod, sonner, clsx, tailwind-merge, lucide-react

Use pnpm. If unavailable use npm.

## 3) PROJECT STRUCTURE

Create:

```
resume-tailor-free/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (dashboard)/tailor/page.tsx
│   ├── api/rewrite/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── upload/resume-upload.tsx
│   ├── jd/job-description.tsx
│   ├── preview/text-preview.tsx
│   ├── result/rewritten-view.tsx
│   ├── result/export-buttons.tsx
│   ├── layout/navbar.tsx
│   ├── layout/footer.tsx
│   ├── shared/privacy-banner.tsx
│   └── shared/ats-checklist.tsx
├── lib/
│   ├── auth/supabase-server.ts
│   ├── auth/supabase-client.ts
│   ├── parsers/pdf-parser.ts
│   ├── parsers/docx-parser.ts
│   ├── parsers/text-parser.ts
│   ├── ai/system-prompt.ts
│   ├── export/pdf.ts
│   ├── export/docx.ts
│   ├── rate-limit/ratelimit.ts
│   ├── utils/guards.ts
│   ├── utils/text.ts
│   ├── utils/format-html.ts
│   ├── utils/env.ts
│   └── types/resume.ts
├── .env.example
├── README.md
└── components.json
```

## 4) UX FLOW

1. "/" – Hero: "Free AI Resume Tailor | ATS-friendly | We never store your resume or JD". CTA "Try for free" -> /tailor
2. "/tailor" – Anonymous view
   - Upload zone (.PDF,.DOCX,.TXT, <=5MB)
   - OR paste resume text
   - JD textarea (<=10000)
   - Live preview + char counts
   - "Tailor with AI" -> if not logged in go to /login?next=/tailor with message "Login to tailor your resume with AI"
   - If logged in call /api/rewrite
3. Result – Tabs "Rewritten" (editable) vs "Original" (read-only)
4. Exports – "Download PDF", "Download DOCX", "Print to PDF"

## 5) NO STORAGE RULES

- Never write to localStorage/sessionStorage/IndexedDB
- Never upload File to API
- Never log resumeText or jobDescription
- Only log: userId?, ipHash, model, inputCharsResume, inputCharsJd, durationMs, status
- State only in useState
- Clear on refresh

## 6) VALIDATION

- File: max 5MB, types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain
- Extracted resume: 100–20000 chars
- JD: 50–10000 chars
- API body validated by zod

## 7) AI PROMPT

Create lib/ai/system-prompt.ts with:

```
You are an ATS-focused resume editor.

STRICT RULES:
- Only rephrase and restructure EXISTING facts.
- Do NOT invent employers, job titles, start/end dates, degrees, certifications, skills, tools, projects, email, phone, location.
- Do NOT fabricate metrics. Only use numbers that already exist.
- Preserve exact names, emails, phone numbers, LinkedIn/portfolio URLs if present.
- Use action verbs and natural phrasing.
- Align with JD keywords without keyword stuffing.
- Avoid tables, columns, headers, footers, images, icons, text boxes, shading.
- Output clean text with sections: Summary, Work Experience, Education, Skills, Projects, Certifications, Other (only if clearly present)
- Return ONLY the rewritten resume content. NO explanation, NO advice, NO JSON, NO markdown backticks.
```

User prompt should include: "RESUME:\n...\n\nJOB DESCRIPTION:\n..."

Use: model from OPENROUTER_MODEL or google/gemini-2.5-flash, temperature 0.25, max_tokens 4096

## 8) API /api/rewrite

- POST only
- Get user from Supabase server client. Require auth -> 401
- Get client IP (x-forwarded-for) and hash
- Rate limit: upstash/ratelimit by userId else by ipHash. limit 3 per 24h
- Validate with zod
- Call OpenRouter with timeout 30s (AbortController)
- Return { rewritten: string }
- Never log full text

## 9) PARSERS

- pdf-parser.ts: use pdf.js to get text items
- docx-parser.ts: use mammoth.extractRawText
- text-parser.ts: trim

All run client-side.

## 10) EXPORTS

- pdf.ts: html2pdf.js from sanitized HTML. Use single column, Inter/system-ui, margins, avoid page-break on big blocks? keep simple
- docx.ts: use docx (Document, Paragraph, HeadingLevel, TextRun, Bullet)
- export-buttons.tsx: call both + window.print()

## 11) UI DETAILS

- shadcn: button, card, textarea, input, tabs, toast, skeleton, label, alert, separator
- Privacy banner visible on / and /tailor
- ATS checklist: "Single column", "Standard fonts", "No tables/images", "Clean bullets"
- Show extracted preview truncated to 600
- Disable "Tailor with AI" until both resume text and JD present
- Loading state with spinner
- Empty/result states

## 12) ENV

.env.example:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-2.5-flash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RATE_LIMIT_PER_DAY=3
MAX_FILE_MB=5
```

lib/utils/env.ts validate server vars.

## 13) README

Include:
- Privacy by design: no storage
- Setup: Supabase (Auth email/magic link), Upstash, OpenRouter
- pnpm i && pnpm dev
- Vercel deploy + envs
- Test: check browser Network tab – no file sent
- "Print to PDF" tip

## 14) BUILD REQUIREMENTS

- TypeScript: no errors
- pnpm build succeeds
- Works at localhost:3000
- No persistence code
- Minimal, clean

## 15) START

Scaffold in /Users/rohithpm/Downloads/resume-tailor-free
Install deps
Create all files
Ensure compile passes
