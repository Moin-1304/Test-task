import userResolvers from "./userResolvers";
import User, { Role } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "../utils/errors";

jest.mock("../models/User");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("userResolvers", () => {
  const mockUser = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    password: "hashedpassword",
    role: Role.EMPLOYEE,
    comparePassword: jest.fn(),
    save: jest.fn(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Query.me", () => {
    it("should return current user if authenticated", async () => {
      User.findById.mockResolvedValue(mockUser);
      const ctx = { user: { id: mockUser._id } };
      const result = await userResolvers.Query.me(null, null, ctx);
      expect(result).toMatchObject({
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
    it("should throw if not authenticated", async () => {
      await expect(userResolvers.Query.me(null, null, {})).rejects.toThrow(
        AuthenticationError
      );
    });
    it("should throw if user not found", async () => {
      User.findById.mockResolvedValue(null);
      const ctx = { user: { id: mockUser._id } };
      await expect(userResolvers.Query.me(null, null, ctx)).rejects.toThrow(
        AuthenticationError
      );
    });
  });

  describe("Mutation.register", () => {
    it("should register a new user and return token", async () => {
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({ ...mockUser, save: jest.fn() }));
      jwt.sign.mockReturnValue("token");
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: Role.EMPLOYEE,
      };
      const result = await userResolvers.Mutation.register(null, { input });
      expect(result).toEqual({ token: "token" });
    });
    it("should throw if email is already in use", async () => {
      User.findOne.mockResolvedValue(mockUser);
      const input = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      await expect(
        userResolvers.Mutation.register(null, { input })
      ).rejects.toThrow(UserInputError);
    });
  });

  describe("Mutation.login", () => {
    it("should login user and return token", async () => {
      User.findOne.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
      });
      jwt.sign.mockReturnValue("token");
      const result = await userResolvers.Mutation.login(null, {
        email: mockUser.email,
        password: "password123",
      });
      expect(result).toEqual({ token: "token" });
    });
    it("should throw if user not found", async () => {
      User.findOne.mockResolvedValue(null);
      await expect(
        userResolvers.Mutation.login(null, {
          email: mockUser.email,
          password: "password123",
        })
      ).rejects.toThrow(UserInputError);
    });
    it("should throw if password is invalid", async () => {
      User.findOne.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      });
      await expect(
        userResolvers.Mutation.login(null, {
          email: mockUser.email,
          password: "wrong",
        })
      ).rejects.toThrow(UserInputError);
    });
  });

  describe("Mutation.updateProfile", () => {
    it("should update user profile", async () => {
      User.findOne.mockResolvedValue(null);
      User.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        name: "Updated",
      });
      const ctx = { user: { id: mockUser._id } };
      const input = { name: "Updated", email: mockUser.email };
      const result = await userResolvers.Mutation.updateProfile(
        null,
        { input },
        ctx
      );
      expect(result.name).toBe("Updated");
    });
    it("should throw if not authenticated", async () => {
      await expect(
        userResolvers.Mutation.updateProfile(null, { input: {} }, {})
      ).rejects.toThrow(AuthenticationError);
    });
    it("should throw if email is already in use", async () => {
      User.findOne.mockResolvedValue(mockUser);
      const ctx = { user: { id: mockUser._id } };
      const input = { email: mockUser.email };
      await expect(
        userResolvers.Mutation.updateProfile(null, { input }, ctx)
      ).rejects.toThrow(UserInputError);
    });
    it("should throw if user not found", async () => {
      User.findOne.mockResolvedValue(null);
      User.findByIdAndUpdate.mockResolvedValue(null);
      const ctx = { user: { id: mockUser._id } };
      const input = { name: "Updated" };
      await expect(
        userResolvers.Mutation.updateProfile(null, { input }, ctx)
      ).rejects.toThrow(UserInputError);
    });
  });

  describe("Mutation.changePassword", () => {
    it("should change password successfully", async () => {
      User.findById.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn(),
      });
      const ctx = { user: { id: mockUser._id } };
      const result = await userResolvers.Mutation.changePassword(
        null,
        { currentPassword: "old", newPassword: "newpassword123" },
        ctx
      );
      expect(result.success).toBe(true);
    });
    it("should fail if not authenticated", async () => {
      await expect(
        userResolvers.Mutation.changePassword(
          null,
          { currentPassword: "old", newPassword: "newpassword123" },
          {}
        )
      ).rejects.toThrow(AuthenticationError);
    });
    it("should fail if user not found", async () => {
      User.findById.mockResolvedValue(null);
      const ctx = { user: { id: mockUser._id } };
      await expect(
        userResolvers.Mutation.changePassword(
          null,
          { currentPassword: "old", newPassword: "newpassword123" },
          ctx
        )
      ).rejects.toThrow(UserInputError);
    });
    it("should fail if current password is incorrect", async () => {
      User.findById.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      });
      const ctx = { user: { id: mockUser._id } };
      const result = await userResolvers.Mutation.changePassword(
        null,
        { currentPassword: "wrong", newPassword: "newpassword123" },
        ctx
      );
      expect(result.success).toBe(false);
      expect(result.message).toBe("Current password is incorrect");
    });
    it("should fail if new password is too short", async () => {
      User.findById.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
      });
      const ctx = { user: { id: mockUser._id } };
      const result = await userResolvers.Mutation.changePassword(
        null,
        { currentPassword: "old", newPassword: "short" },
        ctx
      );
      expect(result.success).toBe(false);
      expect(result.message).toBe("New password must be at least 8 characters");
    });
  });
});
