import type { Metadata } from "next"
import { ShieldCheck, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { safeNextPath } from "@/lib/utils/guards"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams
  const next = safeNextPath(params.next)

  return (
    <div className="editorial-grid min-h-[calc(100svh-8rem)] bg-[#f7f6f2] px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_420px]">
        <section className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#d65540]"><Sparkles className="size-4" /> Resume Tailor workspace</div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Good applications begin with a resume you can stand behind.</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Sign in once to keep the AI tool fair and available for real job seekers.</p>
          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#40514a]"><ShieldCheck className="size-5 text-[#2f7965]" /> No passwords. No resume retention.</div>
        </section>
        <Card className="paper-shadow border border-[#dce1da] bg-white">
          <CardHeader className="px-7 pt-7">
            <p className="text-xs font-semibold tracking-[0.12em] text-[#d65540] uppercase">Welcome</p>
            <CardTitle className="mt-1 text-2xl font-semibold tracking-tight">Sign in to tailor</CardTitle>
            <CardDescription className="mt-2 leading-6">We will email you a secure, one-time sign-in link.</CardDescription>
          </CardHeader>
          <CardContent className="px-7 pb-7 pt-3">
            <LoginForm next={next} linkError={params.error === "link"} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
