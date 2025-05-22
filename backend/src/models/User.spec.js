import bcrypt from "bcryptjs";
import User, { Role } from "./User";

describe("User Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should have required fields and default role", () => {
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(user.name).toBe("Test User");
    expect(user.email).toBe("test@example.com");
    expect(user.role).toBe(Role.EMPLOYEE);
  });

  it("should compare passwords correctly", async () => {
    const compareSpy = jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    const user = new User({ password: "hashed" });
    const result = await user.comparePassword("password123");
    expect(compareSpy).toHaveBeenCalledWith("password123", "hashed");
    expect(result).toBe(true);
  });

  it("should fail password comparison if bcrypt throws", async () => {
    jest.spyOn(bcrypt, "compare").mockRejectedValue(new Error("fail"));
    const user = new User({ password: "hashed" });
    await expect(user.comparePassword("password123")).rejects.toThrow("fail");
  });
});
