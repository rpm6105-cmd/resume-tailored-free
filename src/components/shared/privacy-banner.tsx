import { ShieldCheck } from "lucide-react"

export default function PrivacyBanner() {
  return (
    <div className="border-b border-[#dce1da] bg-[#eef0eb] py-2.5 text-center text-xs font-medium text-[#4c5a55]">
      <span className="inline-flex items-center gap-2"><ShieldCheck className="size-3.5 text-[#2f7965]" /> Files are parsed in your browser. We do not retain your resume or job description.</span>
    </div>
  )
}
