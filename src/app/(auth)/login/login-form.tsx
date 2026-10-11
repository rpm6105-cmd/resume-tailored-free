"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestMagicLink, verifyEmailCode, type LoginState } from "./actions"

const labelClass = "text-xs font-semibold tracking-[0.1em] uppercase text-[#52605a]"

export default function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const router = useRouter()
  const [sendState, sendAction, sending] = useActionState<LoginState, FormData>(requestMagicLink, { status: "idle" })
  const [verifyState, verifyAction, verifying] = useActionState<LoginState, FormData>(verifyEmailCode, { status: "idle" })
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (verifyState.status === "verified") {
      router.replace(verifyState.next)
      router.refresh()
    }
  }, [verifyState, router])

  const sentTo = sendState.status === "sent" ? sendState.email : null

  if (sentTo) {
    return (
      <div className="space-y-5">
        <div className="flex gap-3 border border-[#cfe0d7] bg-[#eef6f1] p-4 text-sm text-[#28473b]" role="status">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-[#2f7965]" />
          <p>
            We sent a sign-in link to <strong>{sentTo}</strong>. Open it on this device, or enter the code from the email below.
          </p>
        </div>
        <form action={verifyAction} className="space-y-3">
          <input type="hidden" name="email" value={sentTo} />
          <input type="hidden" name="next" value={next} />
          <Label htmlFor="code" className={labelClass}>Code from email</Label>
          <Input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6,8}" maxLength={8} placeholder="123456" className="h-11 bg-white tracking-[0.3em]" required />
          {verifyState.status === "error" && <p className="text-sm text-[#bc3d31]" role="alert">{verifyState.message}</p>}
          <Button type="submit" className="h-11 w-full bg-[#18211f] text-white hover:bg-[#2a3633]" disabled={verifying}>
            {verifying ? "Verifying..." : "Verify code"}
          </Button>
        </form>
        <form action={sendAction}>
          <input type="hidden" name="email" value={sentTo} />
          <input type="hidden" name="next" value={next} />
          <button type="submit" disabled={sending} className="text-sm font-medium text-[#d65540] underline-offset-4 hover:underline disabled:opacity-60">
            {sending ? "Sending..." : "Resend email"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <form action={sendAction} className="space-y-5">
      {linkError && (
        <p className="border border-[#efc9c2] bg-[#fdf1ee] p-3 text-sm text-[#8f3326]" role="alert">
          That sign-in link is invalid or has expired. Request a new one below.
        </p>
      )}
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="email" className={labelClass}>Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="h-11 bg-white" />
      </div>
      {sendState.status === "error" && <p className="text-sm text-[#bc3d31]" role="alert">{sendState.message}</p>}
      <Button type="submit" className="h-11 w-full bg-[#e8654c] text-white hover:bg-[#f17a63]" disabled={sending}>
        {sending ? "Sending..." : <>Send sign-in link <ArrowUpRight className="size-4" /></>}
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">
        By continuing, you confirm you are 18 or older and agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">Terms of Use</Link> and{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>, including AI processing of the
        resume text you submit.
      </p>
    </form>
  )
}
