"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Parsers (pdf.js, mammoth) are browser-only, so the workspace skips SSR.
const TailorContent = dynamic(() => import("@/components/tailor/tailor-content"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6" aria-busy="true" aria-label="Loading workspace">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-[480px] w-full" />
    </div>
  ),
})

export default function TailorLoader() {
  return <TailorContent />
}
