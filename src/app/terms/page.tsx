import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { GrievanceOfficer } from "@/components/shared/legal-page"
import { legalConfig, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using ResumeAI by SoftSync Lab.",
}

export default function TermsPage() {
  const { entity, address, jurisdiction } = legalConfig
  return (
    <LegalPage
      title="Terms of Use"
      intro={
        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) are an agreement between you and {entity}, {address} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), for your
          use of {siteConfig.fullName} (the &ldquo;Service&rdquo;). By using the Service you agree to these Terms. If you do not agree, do not use the
          Service.
        </p>
      }
    >
      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old and able to enter into a binding contract under Indian law to use the Service.</p>

      <h2>2. The Service</h2>
      <p>
        The Service uses artificial intelligence to help you build and tailor a resume, optimise it for applicant tracking systems (ATS), and match
        it to a job description. It is currently offered free of charge as a beta, with daily usage limits that we may change, suspend, or withdraw at
        any time.
      </p>

      <h2>3. Your account</h2>
      <p>
        You are responsible for activity under your account and for keeping access to your email secure. Tell us promptly at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> if you suspect unauthorised use.
      </p>

      <h2>4. Your content and responsibilities</h2>
      <ul>
        <li>You keep all rights in the resume and information you submit, and in the output generated for you.</li>
        <li>You grant us a limited licence to process your content solely to provide the Service.</li>
        <li>
          <strong>AI output can be inaccurate.</strong> You must review every part of the output and ensure your resume is truthful before using it.
          You are solely responsible for what you submit to employers.
        </li>
        <li>Only submit information you have the right to use, about yourself or a person who has authorised you.</li>
      </ul>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>create false, misleading, or fraudulent resumes or applications;</li>
        <li>bypass usage limits, use automated scripts or bots, or overload the Service;</li>
        <li>attempt to access accounts, data, or systems you are not authorised to access;</li>
        <li>upload malicious code or content that is unlawful, defamatory, or infringes others&apos; rights;</li>
        <li>use the Service in violation of the Information Technology Act, 2000 or any other applicable law.</li>
      </ul>
      <p>We may suspend or terminate access for any breach of these Terms.</p>

      <h2>6. Intellectual property</h2>
      <p>
        The Service, including its software, design, templates, and branding (&ldquo;ResumeAI&rdquo; and &ldquo;SoftSync Lab&rdquo;), belongs to{" "}
        {entity}. You may not copy, modify, or resell the Service without our written permission.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not guarantee interviews, job offers, any particular
        outcome, compatibility with any specific applicant tracking system, or that the Service will be uninterrupted or error-free.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {entity} is not liable for any indirect, incidental, special, or consequential loss, or for loss of
        opportunity, data, or profits, arising from your use of the Service. As the Service is free, our total liability for any claim is limited to
        INR 1,000.
      </p>

      <h2>9. Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link> explain how we handle your personal data and
        form part of these Terms.
      </p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. The courts at {jurisdiction} have exclusive jurisdiction over any dispute arising from these
        Terms or the Service.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms. We will update the date above, and continued use after an update means you accept the revised Terms.
      </p>

      <h2>12. Contact and grievances</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. Complaints about content or the
        Service may be raised with our Grievance Officer:
      </p>
      <GrievanceOfficer />
    </LegalPage>
  )
}
