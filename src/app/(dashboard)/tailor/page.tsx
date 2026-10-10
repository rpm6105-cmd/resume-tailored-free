"use client"

import dynamic from "next/dynamic"
import { Sparkles } from "lucide-react"
import PrivacyBanner from "@/components/shared/privacy-banner"

const TailorContent = dynamic(() => import("@/components/tailor/tailor-content"), { ssr: false, loading: () => null })

export default function TailorPage() {
  return (
    <div className="flex flex-col">
      <PrivacyBanner />
      <div className="bg-[#f7f6f2]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#dce1da] pb-6 sm:flex-row sm:items-end">
            <div><p className="flex items-center gap-2 text-sm font-semibold text-[#d65540]"><Sparkles className="size-4" /> Resume workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Tailor for one specific role.</h1><p className="mt-2 text-sm text-muted-foreground">Upload your source material, add the opportunity, and review every change.</p></div>
            <p className="text-xs font-medium text-muted-foreground">Step 1 of 3 · Source material</p>
          </div>
          <TailorContent />
        </div>
      </div>
    </div>
  )
}
