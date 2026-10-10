"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Sparkles } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (!ready) return <span className="h-8 w-20" aria-hidden="true" />

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-48 truncate text-xs text-white/60 sm:inline" title={user.email}>{user.email}</span>
        <Button size="sm" variant="ghost" onClick={signOut} className="text-white hover:bg-white/10 hover:text-white">
          <LogOut className="size-3.5" /> Sign out
        </Button>
      </div>
    )
  }

  return (
    <Link href="/login">
      <Button size="sm" className="bg-[#e8654c] px-3 text-white hover:bg-[#f17a63]"><Sparkles className="size-3.5" /> Sign in</Button>
    </Link>
  )
}
