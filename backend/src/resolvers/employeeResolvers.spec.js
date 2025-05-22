import employeeResolvers from "./employeeResolvers";
import Employee from "../models/Employee";
import { Role } from "../models/User";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "../utils/errors";

jest.mock("../models/Employee");

describe("employeeResolvers", () => {
  const mockEmployee = {
    _id: "emp123",
    name: "Emp Name",
    email: "emp@example.com",
    role: Role.EMPLOYEE,
    save: jest.fn(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Query.getEmployees", () => {
    it("should return paginated employees", async () => {
      Employee.countDocuments.mockResolvedValue(1);
      Employee.find.mockReturnValue({
        sort: () => ({ skip: () => ({ limit: () => [mockEmployee] }) }),
      });
      const ctx = { user: { id: "user1" } };
      const args = {
        page: 1,
        limit: 1,
        filter: {},
        sortBy: "name",
        sortOrder: "ASC",
      };
      const result = await employeeResolvers.Query.getEmployees(
        null,
        args,
        ctx
      );
      expect(result.employees.length).toBe(1);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
    });
    it("should throw if not authenticated", async () => {
      await expect(
        employeeResolvers.Query.getEmployees(null, {}, {})
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe("Query.getEmployee", () => {
    it("should return employee by id", async () => {
      Employee.findById.mockResolvedValue(mockEmployee);
      const ctx = { user: { id: "user1" } };
      const result = await employeeResolvers.Query.getEmployee(
        null,
        { id: mockEmployee._id },
        ctx
      );
      expect(result.id).toBe(mockEmployee._id);
    });
    it("should throw if not authenticated", async () => {
      await expect(
        employeeResolvers.Query.getEmployee(null, { id: mockEmployee._id }, {})
      ).rejects.toThrow(AuthenticationError);
    });
    it("should throw if employee not found", async () => {
      Employee.findById.mockResolvedValue(null);
      const ctx = { user: { id: "user1" } };
      await expect(
        employeeResolvers.Query.getEmployee(null, { id: mockEmployee._id }, ctx)
      ).rejects.toThrow(UserInputError);
    });
  });

  describe("Mutation.createEmployee", () => {
    it("should create employee if admin", async () => {
      Employee.findOne.mockResolvedValue(null);
      Employee.mockImplementation(() => ({ ...mockEmployee, save: jest.fn() }));
      const ctx = { user: { id: "admin", role: Role.ADMIN } };
      const input = { name: "Emp Name", email: "emp@example.com" };
      const result = await employeeResolvers.Mutation.createEmployee(
        null,
        { input },
        ctx
      );
      expect(result.name).toBe("Emp Name");
    });
    it("should throw if not authenticated", async () => {
      await expect(
        employeeResolvers.Mutation.createEmployee(null, { input: {} }, {})
      ).rejects.toThrow(AuthenticationError);
    });
    it("should throw if not admin", async () => {
      const ctx = { user: { id: "user1", role: Role.EMPLOYEE } };
      await expect(
        employeeResolvers.Mutation.createEmployee(null, { input: {} }, ctx)
      ).rejects.toThrow(ForbiddenError);
    });
    it("should throw if email is already in use", async () => {
      Employee.findOne.mockResolvedValue(mockEmployee);
      const ctx = { user: { id: "admin", role: Role.ADMIN } };
      const input = { email: "emp@example.com" };
      await expect(
        employeeResolvers.Mutation.createEmployee(null, { input }, ctx)
      ).rejects.toThrow(UserInputError);
    });
  });

  describe("Mutation.updateEmployee", () => {
    it("should update employee if admin", async () => {
      Employee.findOne.mockResolvedValue(null);
      Employee.findByIdAndUpdate.mockResolvedValue({
        ...mockEmployee,
        name: "Updated",
      });
      const ctx = { user: { id: "admin", role: Role.ADMIN } };
      const input = { name: "Updated" };
      const result = await employeeResolvers.Mutation.updateEmployee(
        null,
        { id: mockEmployee._id, input },
        ctx
      );
      expect(result.name).toBe("Updated");
    });
    it("should throw if not authenticated", async () => {
      await expect(
        employeeResolvers.Mutation.updateEmployee(
          null,
          { id: mockEmployee._id, input: {} },
          {}
        )
      ).rejects.toThrow(AuthenticationError);
    });
    it("should throw if not admin", async () => {
      const ctx = { user: { id: "user1", role: Role.EMPLOYEE } };
      await expect(
        employeeResolvers.Mutation.updateEmployee(
          null,
          { id: mockEmployee._id, input: {} },
          ctx
        )
      ).rejects.toThrow(ForbiddenError);
    });
    it("should throw if email is already in use", async () => {
      Employee.findOne.mockResolvedValue(mockEmployee);
      const ctx = { user: { id: "admin", role: Role.ADMIN } };
      const input = { email: "emp@example.com" };
      await expect(
        employeeResolvers.Mutation.updateEmployee(
          null,
          { id: mockEmployee._id, input },
          ctx
        )
      ).rejects.toThrow(UserInputError);
    });
    it("should throw if employee not found", async () => {
      Employee.findOne.mockResolvedValue(null);
      Employee.findByIdAndUpdate.mockResolvedValue(null);
      const ctx = { user: { id: "admin", role: Role.ADMIN } };
      await expect(
        employeeResolvers.Mutation.updateEmployee(
          null,
          { id: mockEmployee._id, input: {} },
          ctx
        )
      ).rejects.toThrow(UserInputError);
    });
  });

  describe("Mutation.deleteEmployee", () => {
    it("should throw if not authenticated", async () => {
      await expect(
        employeeResolvers.Mutation.deleteEmployee(
          null,
          { id: mockEmployee._id },
          {}
        )
      ).rejects.toThrow(AuthenticationError);
    });
    it("should throw if not admin", async () => {
      const ctx = { user: { id: "user1", role: Role.EMPLOYEE } };
      await expect(
        employeeResolvers.Mutation.deleteEmployee(
          null,
          { id: mockEmployee._id },
          ctx
        )
      ).rejects.toThrow(ForbiddenError);
    });
    it("should throw if employee not found", async () => {
      Employee.findByIdAndDelete.mockResolvedValue(null);
      const ctx = { user: { id: "admin", role: Role.ADMIN } };
      await expect(
        employeeResolvers.Mutation.deleteEmployee(
          null,
          { id: mockEmployee._id },
          ctx
        )
      ).rejects.toThrow(UserInputError);
    });
  });
});
