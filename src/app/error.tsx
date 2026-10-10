"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="grid min-h-[calc(100svh-8rem)] place-items-center bg-[#f7f6f2] px-5 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong.</h1>
        <p className="mt-3 text-muted-foreground">An unexpected error occurred. Your resume was not stored anywhere, so you may need to paste it again.</p>
        <Button onClick={() => retry()} className="mt-8 bg-[#e8654c] text-white hover:bg-[#f17a63]">Try again</Button>
        {error.digest && <p className="mt-4 text-xs text-muted-foreground">Reference: {error.digest}</p>}
      </div>
    </div>
  )
}
