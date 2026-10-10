import { resumeToHtml } from "@/lib/utils/format-html"

/** Prints only the resume (not the app chrome) via a hidden iframe. */
export function printResume(text: string) {
  const iframe = document.createElement("iframe")
  iframe.setAttribute("aria-hidden", "true")
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden"
  iframe.srcdoc = resumeToHtml(text)
  iframe.onload = () => {
    const win = iframe.contentWindow
    if (!win) return
    win.addEventListener("afterprint", () => iframe.remove(), { once: true })
    win.focus()
    win.print()
    // Fallback cleanup for browsers that don't fire afterprint.
    setTimeout(() => iframe.remove(), 60_000)
  }
  document.body.appendChild(iframe)
}
