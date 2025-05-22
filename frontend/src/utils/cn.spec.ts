import { cn } from "./cn";

describe("cn utility", () => {
  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });
  it("merges classes", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("handles conflicting Tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("handles undefined and null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
  it("handles arrays and objects", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toContain("a");
    expect(cn(["a", "b"], { c: true, d: false })).toContain("b");
    expect(cn(["a", "b"], { c: true, d: false })).toContain("c");
    expect(cn(["a", "b"], { c: true, d: false })).not.toContain("d");
  });
});
