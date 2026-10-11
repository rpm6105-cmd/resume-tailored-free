import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { siteConfig } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.fullName} · AI Resume Builder & ATS Optimization`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.fullName,
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.fullName,
    title: `${siteConfig.fullName} · AI Resume Builder & ATS Optimization`,
    description: siteConfig.description,
    url: "/",
    images: [{ url: "/images/resume-desk.png", alt: "A printed resume on a professional desk" }],
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: "#18211f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Navbar />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
