"use client"

import { Textarea } from "@/components/ui/textarea"

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function JobDescription({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Job description</label>
      <Textarea rows={7} className="bg-[#fbfcfa]" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste the job description here..." />
      <p className="text-xs text-muted-foreground">{value.length.toLocaleString()} / 10,000 characters</p>
    </div>
  )
}
