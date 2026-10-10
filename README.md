# Resume Tailor

Privacy-first AI resume tailoring. Upload or paste a resume, paste a job description, and get an ATS-friendly rewrite that never invents facts. Nothing is stored.

## How it works

- **Parsing in the browser**: PDF (pdf.js), DOCX (mammoth) and TXT files are read client-side. The file never leaves the device.
- **AI rewrite**: only the extracted text and job description are sent to `/api/rewrite`, which forwards them to OpenRouter (model fixed server-side). Nothing is persisted or logged.
- **Fabrication check**: numbers, emails and links in the rewrite that don't appear in the original are flagged for the user to verify.
- **Export in the browser**: text-based PDF (jsPDF, selectable and ATS-parseable), DOCX (docx), and a clean print view.
- **Auth**: Supabase email magic link or code. An optional `ALLOWED_EMAILS` list restricts sign-in to invited testers.
- **Quota**: per-user and per-IP daily limits in Upstash Redis (UTC day windows). Failed AI calls are refunded. IPs are stored only as salted hashes.

## Tech stack

Next.js 16 (App Router, `proxy.ts`), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), Supabase (`@supabase/ssr`), Upstash Redis, OpenRouter, Vitest.

## Setup

1. `cp .env.example .env.local` and fill in the values (see comments in the file).
2. **Supabase**: create a project and enable the Email provider.
   - *Authentication → URL Configuration*: set Site URL to your app URL, and add `http://localhost:3000/auth/confirm` plus `https://<your-domain>/auth/confirm` to Redirect URLs.
   - *Authentication → Email Templates → Magic Link*: add `{{ .Token }}` to the template so users can type the code (needed when they open the email on a different device).
   - The built-in Supabase email sender has a very low hourly limit. Configure custom SMTP (e.g. Resend) before inviting testers.
3. **Upstash**: create a Redis database and copy the REST URL and token. Required in production; dev falls back to an in-memory counter.
4. **OpenRouter**: create an API key. In OpenRouter privacy settings, consider disabling providers that train on or retain prompts.

## Private beta checklist

- `ALLOWED_EMAILS=you@example.com,friend@gmail.com` (or `@yourcompany.com` for a whole domain)
- `NEXT_PUBLIC_ALLOW_INDEXING=false` keeps search engines out (robots.txt disallows everything, pages are `noindex`)
- Set `NEXT_PUBLIC_SITE_URL` to the deployed URL and `NEXT_PUBLIC_CONTACT_EMAIL` for the Privacy page

To launch publicly: clear `ALLOWED_EMAILS` and set `NEXT_PUBLIC_ALLOW_INDEXING=true`.

## Scripts

```bash
pnpm i          # install
pnpm dev        # dev server on http://localhost:3000
pnpm test       # unit tests (parsing, exports, quota, guards)
pnpm typecheck
pnpm lint
pnpm build && pnpm start
```

## Deploying to Vercel

Import the repo, add every variable from `.env.example` in *Project → Settings → Environment Variables*, and deploy. The rewrite route sets `maxDuration = 60`.

## Manual test

1. Upload a small PDF/DOCX/TXT and paste a job description.
2. Click "Tailor with AI" (sign-in required).
3. Review the rewrite and any flagged details, then download the PDF/DOCX or print.
4. In DevTools → Network, confirm no request carries the file itself.
