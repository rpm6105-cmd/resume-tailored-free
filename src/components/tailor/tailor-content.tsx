"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Sparkles } from "lucide-react"
import { toast } from "sonner"
import ResumeUpload from "@/components/upload/resume-upload"
import JobDescription from "@/components/jd/job-description"
import TextPreview from "@/components/preview/text-preview"
import RewrittenView from "@/components/result/rewritten-view"
import ExportButtons from "@/components/result/export-buttons"
import AtsChecklist from "@/components/shared/ats-checklist"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LIMITS } from "@/lib/limits"
import type { QuotaInfo, RewriteResponse } from "@/lib/types/resume"

type QuotaState = { signedIn: false } | ({ signedIn: true; allowed: boolean } & Partial<QuotaInfo>)

const STEPS = ["Source material", "Tailoring", "Review & export"] as const

export default function TailorContent() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [warnings, setWarnings] = useState<string[]>([])
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [loading, setLoading] = useState(false)
  const [quota, setQuota] = useState<QuotaState | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/quota", { cache: "no-store" })
      .then((r) => r.json())
      .then(setQuota)
      .catch(() => setQuota(null))
  }, [])

  const step = loading ? 1 : rewrittenText ? 2 : 0
  const resumeLen = resumeText.trim().length
  const jdLen = jobDescription.trim().length
  const inputsValid =
    resumeLen >= LIMITS.resumeMin && resumeLen <= LIMITS.resumeMax && jdLen >= LIMITS.jdMin && jdLen <= LIMITS.jdMax
  const outOfCredits = quota?.signedIn && quota.remaining === 0
  const notInvited = quota?.signedIn && !quota.allowed

  const handleTailor = async () => {
    if (quota && !quota.signedIn) {
      router.push("/login?next=/tailor")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 401) {
        router.push("/login?next=/tailor")
        return
      }
      if (!res.ok) {
        toast.error(data.error || "Failed to rewrite. Please try again.")
        if (res.status === 429 && quota?.signedIn) setQuota({ ...quota, remaining: 0 })
        return
      }
      const result = data as RewriteResponse
      setRewrittenText(result.rewritten)
      setWarnings(result.warnings ?? [])
      if (quota?.signedIn) setQuota({ ...quota, ...result.quota })
      requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }))
    } catch {
      toast.error("Network error. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#dce1da] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[#d65540]"><Sparkles className="size-4" /> Resume workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tailor for one specific role.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload your source material, add the opportunity, and review every change.</p>
        </div>
        <div className="text-right text-xs font-medium text-muted-foreground">
          <p aria-live="polite">Step {step + 1} of 3 · {STEPS[step]}</p>
          {quota?.signedIn && quota.remaining !== undefined && (
            <p className="mt-1">{quota.remaining} of {quota.limit} free rewrites left today</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
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
            {notInvited && (
              <p className="text-sm text-[#bc3d31]">This beta is invite-only and your email is not on the tester list yet.</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleTailor}
                disabled={loading || !inputsValid || Boolean(outOfCredits) || Boolean(notInvited)}
                className="h-10 w-full bg-[#e8654c] px-4 text-white hover:bg-[#f17a63] sm:w-auto"
              >
                {loading ? "Tailoring… this can take up to a minute" : quota && !quota.signedIn ? "Sign in to tailor with AI" : "Tailor with AI"}
              </Button>
              {!inputsValid && !loading && (
                <span className="text-xs text-muted-foreground">
                  Needs a resume ({LIMITS.resumeMin}+ chars) and a job description ({LIMITS.jdMin}+ chars).
                </span>
              )}
              {outOfCredits && <span className="text-xs text-muted-foreground">Daily limit reached. Resets at midnight UTC.</span>}
            </div>
          </CardContent>
        </Card>

        {rewrittenText && (
          <Card id="result" className="scroll-mt-24 border border-[#dce1da] bg-white">
            <CardHeader>
              <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">Review & export</p>
              <CardTitle className="text-xl">Your tailored resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warnings.length > 0 && (
                <div className="flex gap-3 border border-[#f0d9a8] bg-[#fdf7ea] p-4 text-sm text-[#6b4e12]" role="alert">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Double-check these details before sending</p>
                    <p className="mt-1">They appear in the rewrite but not in your original resume: {warnings.join(", ")}</p>
                  </div>
                </div>
              )}
              <RewrittenView original={resumeText} rewritten={rewrittenText} onRewrittenChange={setRewrittenText} />
              <ExportButtons text={rewrittenText} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
