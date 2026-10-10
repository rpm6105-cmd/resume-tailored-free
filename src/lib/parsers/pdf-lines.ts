type TextItem = { str: string; transform: number[]; width: number; height: number; hasEOL?: boolean }

function isTextItem(item: unknown): item is TextItem {
  return typeof item === "object" && item !== null && "str" in item && "transform" in item
}

/** Rebuilds lines from positioned text runs so bullets and headings stay on their own lines. */
export function itemsToLines(items: unknown[]): string[] {
  const lines: string[] = []
  let current = ""
  let lastY: number | null = null
  let lastEndX: number | null = null
  let lastHeight = 0

  const flush = () => {
    const clean = current.replace(/\s+/g, " ").trim()
    if (clean) lines.push(clean)
    current = ""
    lastEndX = null
  }

  for (const item of items) {
    if (!isTextItem(item)) continue
    const x = item.transform[4]
    const y = item.transform[5]
    const height = item.height || Math.abs(item.transform[3]) || 10

    if (lastY !== null && Math.abs(y - lastY) > Math.max(2, height * 0.4)) {
      const gap = Math.abs(y - lastY)
      flush()
      // A large vertical gap marks a paragraph/section break.
      if (gap > Math.max(lastHeight, height) * 1.9) lines.push("")
    }

    if (item.str) {
      const needsSpace =
        lastEndX !== null && x - lastEndX > height * 0.15 && !current.endsWith(" ") && !item.str.startsWith(" ")
      current += (needsSpace ? " " : "") + item.str
      lastEndX = x + item.width
    }
    lastY = y
    lastHeight = height

    if (item.hasEOL) flush()
  }
  flush()
  return lines
}
