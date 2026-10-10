import type { Metadata } from "next"
import LegalPage from "@/components/shared/legal-page"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Resume Tailor handles your resume, job description, and account data.",
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 10, 2026">
      <p>
        {siteConfig.name} is built to keep your resume private. This page explains exactly what happens to your data when you use it.
      </p>

      <h2>Your resume and the job description</h2>
      <ul>
        <li>Files you upload are read <strong>in your browser</strong>. The file itself is never uploaded to our servers.</li>
        <li>
          When you click &ldquo;Tailor with AI&rdquo;, the <strong>extracted text</strong> of your resume and the job description are sent
          over an encrypted connection to our server, which forwards them to our AI provider to generate the rewrite.
        </li>
        <li>
          We do <strong>not</strong> save your resume text, the job description, or the rewritten result in any database, file storage, or log.
          They live only in your browser tab and disappear when you close or refresh it.
        </li>
        <li>PDF and DOCX downloads are generated in your browser.</li>
      </ul>

      <h2>AI processing</h2>
      <p>
        Rewrites are generated through <a href="https://openrouter.ai/privacy" target="_blank" rel="noreferrer">OpenRouter</a>, which routes the request to a
        large language model provider (currently Google Gemini). Those providers process the text to produce the response under their own
        privacy terms. Avoid including information you don&apos;t want processed, such as government ID numbers.
      </p>

      <h2>Account data</h2>
      <ul>
        <li>To use the AI rewrite you sign in with your email address. Authentication is handled by Supabase, which stores your email and sign-in timestamps.</li>
        <li>We use essential cookies only, to keep you signed in. We don&apos;t use advertising or tracking cookies.</li>
      </ul>

      <h2>Usage limits</h2>
      <p>
        To keep the service free and prevent abuse, we count how many rewrites each account and network makes per day. We store your account ID
        and a one-way hash of your IP address (never the raw IP) with a counter that expires automatically after about a day.
      </p>

      <h2>Hosting logs</h2>
      <p>
        Our hosting provider records standard request metadata (such as time, URL path, and status code) for security and reliability. Request
        bodies containing your resume are not logged.
      </p>

      <h2>Your choices</h2>
      <p>
        You can stop using the service at any time. To delete your account and email address, contact us
        {siteConfig.contactEmail ? (
          <>
            {" "}at <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </>
        ) : null}
        .
      </p>

      <h2>Changes</h2>
      <p>If we change how we handle data, we will update this page and the date above.</p>
    </LegalPage>
  )
}
