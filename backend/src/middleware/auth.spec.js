import { verifyToken } from "./auth";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Mock dependencies if any
jest.mock("jsonwebtoken");
jest.mock("../models/User");


describe("Auth Middleware - verifyToken", () => {
  const mockUser = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    role: "EMPLOYEE",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should verify token and return user info", async () => {
    jwt.verify.mockReturnValue({ user: { id: mockUser._id } });
    User.findById.mockResolvedValue(mockUser);
    const result = await verifyToken("valid.token");
    expect(result).toEqual({
      id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    });
    expect(jwt.verify).toHaveBeenCalled();
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
  });

  it("should return null for invalid token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });
    const result = await verifyToken("invalid.token");
    expect(result).toBeNull();
  });

  it("should return null for expired token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });
    const result = await verifyToken("expired.token");
    expect(result).toBeNull();
  });

  it("should return null for malformed token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });
    const result = await verifyToken("malformed.token");
    expect(result).toBeNull();
  });

  it("should return null if user not found", async () => {
    jwt.verify.mockReturnValue({ user: { id: mockUser._id } });
    User.findById.mockResolvedValue(null);
    const result = await verifyToken("valid.token");
    expect(result).toBeNull();
  });
});
