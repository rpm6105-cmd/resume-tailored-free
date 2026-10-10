import { describe, expect, it } from "vitest"
import { cleanModelOutput, findUnverifiedFacts, validateRewrite } from "./output"
import { SAMPLE_RESUME } from "@/test/fixtures"

describe("cleanModelOutput", () => {
  it("removes code fences and chatty preambles", () => {
    expect(cleanModelOutput("Here is your tailored resume:\n```\nJane Doe\nSUMMARY\n```")).toBe("Jane Doe\nSUMMARY")
  })
  it("removes trailing notes", () => {
    expect(cleanModelOutput("Jane Doe\nSUMMARY\nNote: I emphasized Kafka.")).toBe("Jane Doe\nSUMMARY")
  })
})

describe("validateRewrite", () => {
  it("rejects empty and tiny outputs", () => {
    expect(validateRewrite("", SAMPLE_RESUME)).toBe("empty")
    expect(validateRewrite("I can't help with that.", SAMPLE_RESUME)).toBe("too_short")
    expect(validateRewrite(SAMPLE_RESUME, SAMPLE_RESUME)).toBeNull()
  })
})

describe("findUnverifiedFacts", () => {
  it("returns nothing when all facts come from the original", () => {
    expect(findUnverifiedFacts(SAMPLE_RESUME, SAMPLE_RESUME)).toEqual([])
  })
  it("flags invented metrics, emails and links", () => {
    const rewritten = `${SAMPLE_RESUME}\n- Increased revenue by 35%\nContact: jane@fake.io | https://janedoe.dev`
    const flagged = findUnverifiedFacts(SAMPLE_RESUME, rewritten)
    expect(flagged).toEqual(expect.arrayContaining(["35%", "jane@fake.io", "https://janedoe.dev"]))
    expect(flagged).not.toContain("40%")
  })
  it("ignores formatting differences in existing numbers", () => {
    expect(findUnverifiedFacts("Served 2,000,000 users", "Served 2000000 users")).toEqual([])
  })
})
