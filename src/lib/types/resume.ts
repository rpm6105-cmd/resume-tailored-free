export type ResumeState = {
  resumeText: string
  jobDescription: string
  rewrittenText: string
  fileName?: string
  fileSize?: number
}

export type ParsedFileResult = {
  text: string
  fileName: string
  fileSize: number
}

export type RewriteRequest = {
  resumeText: string
  jobDescription: string
  model?: string
}

export type RewriteResponse = {
  rewritten: string
}
