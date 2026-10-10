"use client"

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f7f6f2", color: "#18211f", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <title>Something went wrong · Resume Tailor</title>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#65706c" }}>Please try again in a moment.</p>
          <button onClick={() => retry()} style={{ marginTop: 16, background: "#e8654c", color: "#fff", border: 0, borderRadius: 8, padding: "10px 18px", fontSize: 14, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
