export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + "..."
}

export function countChars(text: string): number {
  return text.length
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
