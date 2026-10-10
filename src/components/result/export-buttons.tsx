"use client"

import { useState } from "react"
import { Download, Printer } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type Props = {
  text: string
}

type Format = "pdf" | "docx"

export default function ExportButtons({ text }: Props) {
  const [busy, setBusy] = useState<Format | null>(null)

  const run = async (format: Format) => {
    if (!text.trim()) return
    setBusy(format)
    try {
      if (format === "pdf") {
        const { downloadPdf } = await import("@/lib/export/pdf")
        downloadPdf(text)
      } else {
        const { downloadDocx } = await import("@/lib/export/docx")
        await downloadDocx(text)
      }
    } catch {
      toast.error(`Could not create the ${format.toUpperCase()} file. Please try again.`)
    } finally {
      setBusy(null)
    }
  }

  const handlePrint = async () => {
    const { printResume } = await import("@/lib/export/print")
    printResume(text)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => run("pdf")} disabled={busy !== null} className="bg-[#e8654c] text-white hover:bg-[#f17a63]">
        <Download className="size-4" /> {busy === "pdf" ? "Preparing..." : "Download PDF"}
      </Button>
      <Button onClick={() => run("docx")} disabled={busy !== null} variant="secondary">
        <Download className="size-4" /> {busy === "docx" ? "Preparing..." : "Download DOCX"}
      </Button>
      <Button onClick={handlePrint} variant="outline">
        <Printer className="size-4" /> Print
      </Button>
    </div>
  )
}
