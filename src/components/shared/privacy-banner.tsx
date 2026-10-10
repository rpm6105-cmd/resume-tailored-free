import { ShieldCheck } from "lucide-react"

export default function PrivacyBanner() {
  return (
    <div className="border-b border-[#dce1da] bg-[#eef0eb] py-2.5 text-center text-xs font-medium text-[#4c5a55]">
      <span className="inline-flex items-center gap-2 px-4"><ShieldCheck className="size-3.5 text-[#2f7965]" /> Files are read in your browser. Only the text is sent to our AI provider for the rewrite, and nothing is stored.</span>
    </div>
  )
}
