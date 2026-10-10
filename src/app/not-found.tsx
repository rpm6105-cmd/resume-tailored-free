import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="editorial-grid grid min-h-[calc(100svh-8rem)] place-items-center bg-[#f7f6f2] px-5 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#d65540] uppercase">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
        <p className="mt-3 text-muted-foreground">The link may be broken or the page may have moved.</p>
        <Link href="/" className="mt-8 inline-block"><Button className="bg-[#e8654c] text-white hover:bg-[#f17a63]">Back to home</Button></Link>
      </div>
    </div>
  )
}
