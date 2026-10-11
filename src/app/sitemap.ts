import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/tailor", "/contact", "/privacy", "/terms", "/cookies"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }))
}
