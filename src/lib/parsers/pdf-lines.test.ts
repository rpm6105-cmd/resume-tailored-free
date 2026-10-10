import { describe, expect, it } from "vitest"
import { itemsToLines } from "./pdf-lines"

const item = (str: string, x: number, y: number, width = str.length * 5, hasEOL = false) => ({
  str,
  transform: [10, 0, 0, 10, x, y],
  width,
  height: 10,
  hasEOL,
})

describe("itemsToLines", () => {
  it("keeps separate visual lines separate", () => {
    const lines = itemsToLines([item("SKILLS", 50, 700), item("- Go", 50, 686), item("- Python", 50, 672)])
    expect(lines).toEqual(["SKILLS", "- Go", "- Python"])
  })

  it("joins runs on the same line with a space only when there is a gap", () => {
    const lines = itemsToLines([item("Senior", 50, 700, 30), item("Engineer", 85, 700), item("ing", 125, 700)])
    expect(lines).toEqual(["Senior Engineering"])
  })

  it("inserts a blank line for large vertical gaps", () => {
    expect(itemsToLines([item("Name", 50, 700), item("SUMMARY", 50, 640)])).toEqual(["Name", "", "SUMMARY"])
  })
})
