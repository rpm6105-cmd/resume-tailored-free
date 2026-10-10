import Link from "next/link"
import { FilePenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthButton from "./auth-button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#18211f] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-[#e8654c] text-white"><FilePenLine className="size-4" /></span>
          <span>Resume Tailor</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/tailor"><Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">Workspace</Button></Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  )
}
