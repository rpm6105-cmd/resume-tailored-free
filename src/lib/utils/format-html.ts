export function resumeToHtml(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  let html = ""
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      html += "<br/>"
      continue
    }
    if (/^[-*•]\s+/.test(trimmed)) {
      html += `<li>${escapeHtml(trimmed.replace(/^[-*•]\s+/, ""))}</li>`
      continue
    }
    if (/^(summary|work experience|experience|education|skills|projects|certifications|other):/i.test(trimmed)) {
      html += `<h3 style="margin:16px 0 8px 0;font-size:16px;font-weight:700;">${escapeHtml(trimmed)}</h3>`
      continue
    }
    html += `<p style="margin:8px 0;line-height:1.6;">${escapeHtml(trimmed)}</p>`
  }
  if (html.includes("<li>")) {
    html = html.replace(/(<li>[\s\S]*?<\/li>)(?=<li>|<h3>|<p>|<br\/>)/g, "<ul>$1</ul>")
  }
  return `<div style="font-family:Inter,system-ui,-apple-system,Arial,sans-serif;font-size:12px;line-height:1.6;color:#000;padding:20px;">${html}</div>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
