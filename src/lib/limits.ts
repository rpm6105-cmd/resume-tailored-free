/** Input bounds shared by the client form and the API schema. */
export const LIMITS = {
  resumeMin: 100,
  resumeMax: 20000,
  jdMin: 50,
  jdMax: 10000,
  fileMaxBytes: 5 * 1024 * 1024,
} as const
