import Link from "next/link"
import { legalConfig, siteConfig } from "@/lib/site"

const links = [
  { href: "/contact", label: "Contact & Support" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
]

export default function Footer() {
  return (
    <footer className="border-t bg-white py-8 text-xs text-muted-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-[1fr_auto] sm:items-start lg:px-8">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground">{siteConfig.fullName}</p>
          <p>{siteConfig.tagline.join(" • ")}</p>
          <p>
            Support: <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-foreground">{siteConfig.contactEmail}</a>
          </p>
          <p>© {new Date().getFullYear()} {legalConfig.entity}, {legalConfig.address}</p>
        </div>
        <nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
