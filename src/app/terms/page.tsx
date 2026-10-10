import type { Metadata } from "next"
import Link from "next/link"
import LegalPage from "@/components/shared/legal-page"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using Resume Tailor.",
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 10, 2026">
      <p>By using {siteConfig.name} you agree to these terms. If you don&apos;t agree, please don&apos;t use the service.</p>

      <h2>The service</h2>
      <p>
        {siteConfig.name} uses AI to suggest rewrites of a resume you provide so it better matches a job description. It is provided free of
        charge, &ldquo;as is&rdquo;, with daily usage limits that we may change at any time.
      </p>

      <h2>Your responsibility</h2>
      <ul>
        <li>AI output can contain mistakes. Review every word before you use it and make sure your resume is accurate and truthful.</li>
        <li>Only submit content you have the right to use. You keep ownership of your resume and of the rewritten text.</li>
        <li>Don&apos;t use the service to create misleading or fraudulent applications.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t try to bypass usage limits, automate requests, overload the service, or use it for anything other than improving your own (or
        a consenting person&apos;s) resume. We may suspend access for misuse.
      </p>

      <h2>No guarantees</h2>
      <p>
        We don&apos;t guarantee interviews, job offers, or compatibility with any specific applicant tracking system. To the maximum extent
        permitted by law, we are not liable for any loss arising from use of the service.
      </p>

      <h2>Privacy</h2>
      <p>
        See our <Link href="/privacy">Privacy Policy</Link> for how your data is handled.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use after an update means you accept the new terms.</p>
    </LegalPage>
  )
}
