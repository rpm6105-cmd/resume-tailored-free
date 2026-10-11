import type { Metadata } from "next"
import Link from "next/link"
import LegalPage from "@/components/shared/legal-page"
import { legalConfig, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies ResumeAI by SoftSync Lab uses and why.",
}

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro={
        <p>
          This Cookie Policy explains how {legalConfig.entity} uses cookies and similar technologies on {siteConfig.fullName}. It should be read
          together with our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      }
    >
      <h2>1. What cookies are</h2>
      <p>Cookies are small text files a website stores in your browser so it can remember information between page visits.</p>

      <h2>2. Cookies we use</h2>
      <p>
        We use <strong>only strictly necessary cookies</strong>. They are required for signing in and keeping your account secure, so the Service
        cannot work without them. We do <strong>not</strong> use analytics, advertising, social media, or tracking cookies.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>sb-…-auth-token</code></td>
            <td>Supabase (on our domain)</td>
            <td>Keeps you signed in and verifies your session</td>
            <td>Until you sign out or the session expires</td>
          </tr>
          <tr>
            <td><code>sb-…-auth-token-code-verifier</code></td>
            <td>Supabase (on our domain)</td>
            <td>Securely completes email sign-in (PKCE)</td>
            <td>Minutes, removed after sign-in</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do not store your resume or job description in cookies, local storage, or any other browser storage.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. If you block the cookies above, you will not be able to sign in to use the AI
        features.
      </p>

      <h2>4. Changes</h2>
      <p>
        If we add any non-essential cookies in future (for example, analytics), we will update this policy and ask for your consent before setting
        them.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions about cookies: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </LegalPage>
  )
}
