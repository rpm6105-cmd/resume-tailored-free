import type { Metadata } from "next"
import Link from "next/link"
import { Mail, ShieldCheck, LifeBuoy } from "lucide-react"
import { GrievanceOfficer } from "@/components/shared/legal-page"
import { legalConfig, siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Get help with ResumeAI by SoftSync Lab, or contact our Grievance Officer.",
}

export default function ContactPage() {
  return (
    <div className="editorial-grid bg-[#f7f6f2]">
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">We&apos;re here to help</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Contact & Support</h1>
        <p className="mt-4 text-[15px] leading-7 text-[#33403b]">
          Questions, feedback, bug reports, or privacy requests: email us and a real person at {legalConfig.entity} will reply.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a href={`mailto:${siteConfig.contactEmail}`} className="group border border-[#dce1da] bg-white p-5 transition-colors hover:border-[#e8654c]">
            <Mail className="size-5 text-[#e8654c]" />
            <p className="mt-3 font-semibold">Email support</p>
            <p className="mt-1 text-sm text-[#d65540] underline-offset-4 group-hover:underline">{siteConfig.contactEmail}</p>
            <p className="mt-2 text-sm text-muted-foreground">We usually reply within 1–2 business days.</p>
          </a>
          <div className="border border-[#dce1da] bg-white p-5">
            <LifeBuoy className="size-5 text-[#2f7965]" />
            <p className="mt-3 font-semibold">When you write to us</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>Use the email linked to your account</li>
              <li>Describe what happened and when</li>
              <li>Please don&apos;t send your full resume or ID documents</li>
            </ul>
          </div>
        </div>

        <h2 className="mt-12 flex items-center gap-2 text-xl font-semibold"><ShieldCheck className="size-5 text-[#2f7965]" /> Privacy requests and grievances</h2>
        <p className="mt-3 text-[15px] leading-7 text-[#33403b]">
          To access, correct, or delete your personal data, withdraw consent, or raise a complaint, contact our Grievance Officer. See our{" "}
          <Link href="/privacy" className="text-[#d65540] underline underline-offset-4">Privacy Policy</Link> for details.
        </p>
        <div className="mt-4 text-[15px] leading-7 text-[#33403b] [&_a]:text-[#d65540] [&_a]:underline [&_a]:underline-offset-4">
          <GrievanceOfficer />
        </div>
      </div>
    </div>
  )
}
