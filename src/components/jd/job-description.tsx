"use client"

import { Textarea } from "@/components/ui/textarea"
import { LIMITS } from "@/lib/limits"

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function JobDescription({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor="job-description" className="text-sm font-semibold">Job description</label>
      <Textarea id="job-description" rows={7} maxLength={LIMITS.jdMax} className="bg-[#fbfcfa]" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste the job description here..." />
      <p className="text-xs text-muted-foreground">{value.length.toLocaleString()} / {LIMITS.jdMax.toLocaleString()} characters</p>
    </div>
  )
}
