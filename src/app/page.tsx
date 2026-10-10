import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Check, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import PrivacyBanner from "@/components/shared/privacy-banner"

const steps = [
  ["01", "Bring your resume", "Upload a PDF or DOCX, or simply paste your current text."],
  ["02", "Match the role", "Add the job description and let AI surface relevant language."],
  ["03", "Review every word", "Edit the result, then export a clean, ATS-friendly version."],
]

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      <PrivacyBanner />
      <section className="relative min-h-[calc(100svh-6.5rem)] overflow-hidden bg-[#18211f] text-white">
        <Image src="/images/resume-desk.png" alt="A printed resume on a professional desk" fill priority className="object-cover object-[68%_center] opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#18211f_0%,rgba(24,33,31,0.9)_42%,rgba(24,33,31,0.28)_74%,rgba(24,33,31,0.08)_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-7xl items-center px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="hero-reveal mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/8 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#f6c5b8] uppercase"><Sparkles className="size-3.5" /> AI resume studio</div>
            <p className="hero-reveal text-sm font-medium text-white/65">Resume Tailor</p>
            <h1 className="hero-reveal text-balance mt-3 text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">A sharper resume for the role you actually want.</h1>
            <p className="hero-reveal-delay mt-7 max-w-xl text-lg leading-8 text-white/75">Bring your experience. We help you find the language, proof, and keywords that make it easier for the right recruiter to see your value.</p>
            <div className="hero-reveal-delay mt-9 flex flex-wrap items-center gap-3">
              <Link href="/tailor"><Button size="lg" className="h-11 bg-[#e8654c] px-5 text-white hover:bg-[#f17a63]">Tailor my resume <ArrowUpRight className="size-4" /></Button></Link>
              <span className="text-sm text-white/60">Free to try. No card required.</span>
            </div>
          </div>
        </div>
      </section>
      <section className="editorial-grid bg-[#f7f6f2] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div><p className="text-sm font-semibold text-[#d65540]">Designed for the application moment</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A clear path from draft to ready-to-send.</h2></div>
          <div className="grid gap-7 sm:grid-cols-3">{steps.map(([number, title, copy]) => <div key={number} className="border-t border-[#18211f] pt-4"><p className="text-xs font-semibold tracking-[0.16em] text-[#d65540]">{number}</p><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>)}</div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div className="border-l-2 border-[#e8654c] pl-6"><FileText className="size-5 text-[#e8654c]" /><h2 className="mt-6 text-3xl font-semibold tracking-tight">Built to help, not embellish.</h2><p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">Your resume stays yours. Files are read in your browser, and the text sent for the rewrite is never saved. Suggestions focus on clearer wording and role alignment without fabricating experience, achievements, or skills.</p></div>
          <ul className="space-y-4 text-sm font-medium">{["Files are read in your browser; resume text is never stored", "Single-column, ATS-conscious output", "Edit before every export"].map(item => <li key={item} className="flex items-center gap-3 border-b pb-4"><span className="grid size-6 place-items-center rounded-full bg-[#e8ece8] text-[#2f7965]"><Check className="size-3.5" /></span>{item}</li>)}</ul>
        </div>
      </section>
    </div>
  )
}
