import { truncate } from "@/lib/utils/text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  resumeText: string
  jobDescription: string
  fileName?: string
  fileSize?: number
}

export default function TextPreview({ resumeText, jobDescription, fileName, fileSize }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Extracted resume ({resumeText.length} chars)</CardTitle></CardHeader>
        <CardContent>
          {fileName && <p className="text-xs text-muted-foreground mb-2">{fileName} • {(fileSize || 0)} bytes</p>}
          <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded max-h-60 overflow-auto">{resumeText ? truncate(resumeText, 600) : "No resume extracted yet"}</pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Job description ({jobDescription.length} chars)</CardTitle></CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded max-h-60 overflow-auto">{jobDescription ? truncate(jobDescription, 600) : "No JD yet"}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
