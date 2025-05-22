import dashboardResolvers from "./dashboardResolvers";
import Employee from "../models/Employee";
import { AuthenticationError } from "../utils/errors";

// Mock dependencies if any
jest.mock("../models/Employee");

// Test suite for dashboardResolvers
describe("dashboardResolvers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Query.dashboardStats", () => {
    it("should return dashboard stats for authenticated user", async () => {
      Employee.countDocuments
        .mockResolvedValueOnce(10) // totalEmployees
        .mockResolvedValueOnce(2); // newEmployees
      Employee.aggregate
        .mockResolvedValueOnce([{ avgAttendance: 0.85 }]) // attendanceResult
        .mockResolvedValueOnce([{ _id: "Dept1" }, { _id: "Dept2" }]); // departmentsResult
      const ctx = { user: { id: "user1" } };
      const result = await dashboardResolvers.Query.dashboardStats(
        null,
        null,
        ctx
      );
      expect(result).toEqual({
        totalEmployees: 10,
        newEmployees: 2,
        attendanceRate: 0.85,
        departmentsCount: 2,
      });
    });
    it("should throw if not authenticated", async () => {
      await expect(
        dashboardResolvers.Query.dashboardStats(null, null, {})
      ).rejects.toThrow(AuthenticationError);
    });
    it("should handle no employees edge case", async () => {
      Employee.countDocuments.mockResolvedValue(0);
      Employee.aggregate.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      const ctx = { user: { id: "user1" } };
      const result = await dashboardResolvers.Query.dashboardStats(
        null,
        null,
        ctx
      );
      expect(result).toEqual({
        totalEmployees: 0,
        newEmployees: 0,
        attendanceRate: 0,
        departmentsCount: 0,
      });
    });
  });
});
