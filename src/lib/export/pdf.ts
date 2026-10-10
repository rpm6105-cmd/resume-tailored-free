import html2pdf from "html2pdf.js"
import { resumeToHtml } from "../utils/format-html"

export async function downloadPdf(text: string, filename = "tailored-resume.pdf") {
  const element = document.createElement("div")
  element.innerHTML = resumeToHtml(text)
  const opt = {
    margin: 0.5,
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
  }
  await html2pdf().set(opt).from(element).save()
}
