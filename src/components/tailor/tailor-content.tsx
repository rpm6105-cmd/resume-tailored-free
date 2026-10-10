"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/auth/supabase-client"
import ResumeUpload from "@/components/upload/resume-upload"
import JobDescription from "@/components/jd/job-description"
import TextPreview from "@/components/preview/text-preview"
import RewrittenView from "@/components/result/rewritten-view"
import ExportButtons from "@/components/result/export-buttons"
import AtsChecklist from "@/components/shared/ats-checklist"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TailorContent() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleTailor = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login?next=/tailor")
      return
    }
    if (resumeText.length < 100) {
      toast.error("Resume text too short")
      return
    }
    if (jobDescription.length < 50) {
      toast.error("Job description too short")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to rewrite")
        return
      }
      setRewrittenText(data.rewritten)
    } catch (e) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="border border-[#dce1da] bg-white">
        <CardHeader>
          <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">Source material</p>
          <CardTitle className="text-xl">Add your resume and the role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResumeUpload
            onTextExtracted={(text, name, size) => {
              setResumeText(text)
              setFileName(name)
              setFileSize(size)
            }}
          />
          <JobDescription value={jobDescription} onChange={setJobDescription} />
          <TextPreview resumeText={resumeText} jobDescription={jobDescription} fileName={fileName} fileSize={fileSize} />
          <AtsChecklist />
          <Button
            onClick={handleTailor}
            disabled={loading || resumeText.length < 100 || jobDescription.length < 50}
            className="h-10 w-full bg-[#e8654c] px-4 text-white hover:bg-[#f17a63] sm:w-auto"
          >
            {loading ? "Tailoring..." : "Tailor with AI"}
          </Button>
        </CardContent>
      </Card>

      {rewrittenText && (
        <Card className="border border-[#dce1da] bg-white">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RewrittenView original={resumeText} rewritten={rewrittenText} onRewrittenChange={setRewrittenText} />
            <ExportButtons text={rewrittenText} />
          </CardContent>
        </Card>
      )}
    </>
  )
}
