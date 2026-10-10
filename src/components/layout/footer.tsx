import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white py-7 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span className="font-medium text-foreground">Resume Tailor</span>
        <span>Files are read in your browser. Resume text is never stored.</span>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </div>
    </footer>
  )
}
