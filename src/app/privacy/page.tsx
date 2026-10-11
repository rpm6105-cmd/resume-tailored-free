import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { GrievanceOfficer } from "@/components/shared/legal-page"
import { legalConfig, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ResumeAI by SoftSync Lab collects, uses, and protects your personal data under Indian law.",
}

export default function PrivacyPage() {
  const { entity, address } = legalConfig
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This Privacy Policy explains how {entity} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), based in {address}, processes your personal data when you use{" "}
          {siteConfig.fullName} (the &ldquo;Service&rdquo;). It is published in accordance with the Digital Personal Data Protection Act, 2023 and the
          Digital Personal Data Protection Rules, 2025 (together, &ldquo;DPDP law&rdquo;), and the Information Technology Act, 2000 with the Information
          Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
        </p>
      }
    >
      <h2>1. Who is responsible for your data</h2>
      <p>
        {entity} is the <strong>Data Fiduciary</strong> for personal data processed through the Service. You can reach us at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h2>2. Personal data we process</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Why we process it</th>
            <th>How long we keep it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email address and sign-in records</td>
            <td>To create your account, sign you in, and contact you about the Service</td>
            <td>Until you delete your account</td>
          </tr>
          <tr>
            <td>Resume text and job description you submit</td>
            <td>To generate the AI rewrite you request</td>
            <td>
              <strong>Not stored.</strong> Processed in memory to produce the result and then discarded. Files you upload are read in your browser
              and never sent to our servers.
            </td>
          </tr>
          <tr>
            <td>Account ID and a one-way hash of your IP address</td>
            <td>To enforce fair daily usage limits and prevent abuse</td>
            <td>About 26 hours, then automatically deleted</td>
          </tr>
          <tr>
            <td>Technical logs (time, page, status code, browser type)</td>
            <td>Security, troubleshooting, and reliability</td>
            <td>As retained by our hosting provider, typically up to 30 days</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do not ask for, and you should not include, sensitive information such as passwords, financial account details, government ID numbers
        (e.g. Aadhaar or PAN), health information, or biometric data.
      </p>

      <h2>3. Consent</h2>
      <p>
        We process your personal data on the basis of your consent, which you give by creating an account and by choosing to submit your resume
        for an AI rewrite. You may <strong>withdraw consent at any time</strong> by stopping use of the Service and asking us to delete your account at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. Withdrawal does not affect processing that happened before it.
      </p>

      <h2>4. Service providers (Data Processors)</h2>
      <p>We share personal data only with providers that help us run the Service, under contracts that require them to protect it:</p>
      <ul>
        <li><strong>Vercel</strong>: website hosting and delivery.</li>
        <li><strong>Supabase</strong>: account authentication and the usage-limit database.</li>
        <li>
          <strong>Anthropic</strong> (Claude AI models): generating the rewrite from the text you submit. Anthropic does not use data sent
          through its commercial API to train its models by default. See{" "}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Anthropic&apos;s privacy policy</a>.
        </li>
        <li>
          <strong>OpenRouter</strong>: a backup AI gateway we may use if our primary AI provider is unavailable. See{" "}
          <a href="https://openrouter.ai/privacy" target="_blank" rel="noreferrer">OpenRouter&apos;s privacy policy</a>.
        </li>
        <li><strong>Resend</strong>: delivering sign-in emails.</li>
      </ul>
      <p>We do not sell your personal data and do not share it for advertising.</p>

      <h2>5. Transfers outside India</h2>
      <p>
        Our service providers operate servers outside India, including in South Korea and the United States. Personal data may be processed in
        those countries. We transfer data only as permitted under DPDP law and do not transfer data to any country restricted by the Government of
        India.
      </p>

      <h2>6. Your rights</h2>
      <p>Under DPDP law you have the right to:</p>
      <ul>
        <li><strong>Access</strong>: a summary of the personal data we hold about you and how we process it.</li>
        <li><strong>Correction and completion</strong>: correct inaccurate or incomplete data, and update it.</li>
        <li><strong>Erasure</strong>: have your account and personal data deleted.</li>
        <li><strong>Withdraw consent</strong> at any time.</li>
        <li><strong>Grievance redressal</strong>: raise a complaint with our Grievance Officer (below).</li>
        <li><strong>Nominate</strong> another person to exercise these rights on your behalf in the event of your death or incapacity.</li>
      </ul>
      <p>
        To exercise any right, email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> from the address linked to your
        account. We may ask you to confirm your identity before acting on a request.
      </p>

      <h2>7. Children</h2>
      <p>
        The Service is intended only for people aged <strong>18 or older</strong>. We do not knowingly process the personal data of children. If you
        believe a child has used the Service, contact us and we will delete the data.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable security safeguards, including encryption in transit (HTTPS), access controls, row-level security on our database,
        hashing of IP addresses, and not storing resume content at all. No system is perfectly secure, but we work to protect your data.
      </p>
      <p>
        If a personal data breach occurs, we will inform affected users and the Data Protection Board of India as required by DPDP law.
      </p>

      <h2>9. Cookies</h2>
      <p>
        We use only essential cookies needed to keep you signed in. See our <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>10. Grievances and complaints</h2>
      <p>For any question, request, or complaint about your personal data, contact our Grievance Officer:</p>
      <GrievanceOfficer />
      <p>
        If you are not satisfied with our response, you may file a complaint with the <strong>Data Protection Board of India</strong> after first
        contacting us.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy as the Service or the law changes. We will update the date above, and for significant changes we will notify you
        by email or on the website.
      </p>
    </LegalPage>
  )
}
