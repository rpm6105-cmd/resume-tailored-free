"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/tailor"
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}${next}` },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Check your email for the login link")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-semibold tracking-[0.1em] uppercase text-[#52605a]">Email address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="h-11 bg-white" />
      </div>
      <Button type="submit" className="h-11 w-full bg-[#e8654c] text-white hover:bg-[#f17a63]" disabled={loading}>
        {loading ? "Sending..." : <>Send magic link <ArrowUpRight className="size-4" /></>}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="editorial-grid min-h-[calc(100svh-8rem)] bg-[#f7f6f2] px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_420px]">
        <section className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#d65540]"><Sparkles className="size-4" /> Resume Tailor workspace</div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Good applications begin with a resume you can stand behind.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Sign in once to keep the AI tool thoughtful and available for real job seekers.</p>
          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#40514a]"><ShieldCheck className="size-5 text-[#2f7965]" /> No passwords. No resume retention.</div>
        </section>
        <Card className="paper-shadow border border-[#dce1da] bg-white">
          <CardHeader className="px-7 pt-7">
            <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">Welcome back</p>
            <CardTitle className="mt-1 text-2xl font-semibold tracking-tight">Sign in to tailor</CardTitle>
            <CardDescription className="mt-2 leading-6">We will email you a secure, one-time sign-in link.</CardDescription>
          </CardHeader>
          <CardContent className="px-7 pb-7 pt-3"><Suspense fallback={<div>Loading...</div>}><LoginForm /></Suspense></CardContent>
        </Card>
      </div>
    </div>
  )
}
