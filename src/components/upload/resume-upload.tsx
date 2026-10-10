"use client"

import { useRef, useState } from "react"
import { parsePdf } from "@/lib/parsers/pdf-parser"
import { parseDocx } from "@/lib/parsers/docx-parser"
import { parseText } from "@/lib/parsers/text-parser"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type Props = {
  onTextExtracted: (text: string, fileName: string, fileSize: number) => void
}

export default function ResumeUpload({ onTextExtracted }: Props) {
  const [text, setText] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [parsing, setParsing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const max = 5 * 1024 * 1024
    if (file.size > max) {
      toast.error("File too large (max 5MB)")
      return
    }
    const ext = file.name.toLowerCase()
    setParsing(true)
    try {
      let parsed = ""
      if (ext.endsWith(".pdf")) {
        parsed = await parsePdf(file)
      } else if (ext.endsWith(".docx")) {
        parsed = await parseDocx(file)
      } else if (ext.endsWith(".txt")) {
        parsed = await file.text()
        parsed = parseText(parsed)
      } else {
        toast.error("Unsupported file type (.pdf, .docx, .txt)")
        return
      }
      setText(parsed)
      onTextExtracted(parsed, file.name, file.size)
      toast.success("Resume text extracted")
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      if (message.includes("selectable text")) {
        toast.error("This looks like a scanned PDF. Please paste its text or use a text-based PDF.")
      } else if (message.toLowerCase().includes("password")) {
        toast.error("This PDF is password-protected. Remove the password and try again.")
      } else {
        toast.error("We could not read that file. Try a PDF, DOCX, or TXT version.")
      }
    } finally {
      setParsing(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`cursor-pointer border border-dashed border-[#aab6af] bg-[#fbfcfa] p-8 text-center transition-colors ${dragActive ? "bg-[#e8ece8]" : "hover:bg-[#f3f5f1]"}`}
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-sm font-semibold">{parsing ? "Reading your resume..." : "Drop your resume here, or browse your files"}</p>
        <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, or TXT · Max 5MB · Parsed in your browser</p>
        <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Or paste resume text</label>
        <Textarea rows={8} className="bg-[#fbfcfa]" value={text} onChange={(e) => { setText(e.target.value); onTextExtracted(e.target.value, "pasted", e.target.value.length) }} placeholder="Paste your resume here..." />
      </div>
    </div>
  )
}
