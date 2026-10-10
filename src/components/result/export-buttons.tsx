"use client"

import { Button } from "@/components/ui/button"
import { downloadPdf } from "@/lib/export/pdf"
import { downloadDocx } from "@/lib/export/docx"

type Props = {
  text: string
}

export default function ExportButtons({ text }: Props) {
  const handlePdf = async () => {
    await downloadPdf(text)
  }
  const handleDocx = async () => {
    await downloadDocx(text)
  }
  const handlePrint = () => {
    window.print()
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handlePdf}>Download PDF</Button>
      <Button onClick={handleDocx} variant="secondary">Download DOCX</Button>
      <Button onClick={handlePrint} variant="outline">Print to PDF</Button>
    </div>
  )
}
