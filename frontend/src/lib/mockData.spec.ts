import { mockEmployees } from "./mockData";

describe("mockEmployees", () => {
  it("should be an array", () => {
    expect(Array.isArray(mockEmployees)).toBe(true);
  });
  it("should have required fields for each employee", () => {
    for (const emp of mockEmployees) {
      expect(emp).toHaveProperty("id");
      expect(emp).toHaveProperty("name");
      expect(emp).toHaveProperty("email");
      expect(emp).toHaveProperty("department");
    }
  });
});
