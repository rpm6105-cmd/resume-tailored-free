import type { Metadata } from "next"
import PrivacyBanner from "@/components/shared/privacy-banner"
import TailorLoader from "./tailor-loader"

export const metadata: Metadata = {
  title: "Workspace",
  description: "Upload your resume, paste a job description, and get an ATS-friendly tailored rewrite.",
}

export default function TailorPage() {
  return (
    <div className="flex flex-col">
      <PrivacyBanner />
      <div className="bg-[#f7f6f2]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <TailorLoader />
        </div>
      </div>
    </div>
  )
}
