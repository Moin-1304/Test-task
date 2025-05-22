const { someUtilityFunction } = require("./errors");
import { AuthenticationError, ForbiddenError, UserInputError } from "./errors";

describe("Custom Error Classes", () => {
  it("should create an AuthenticationError with correct name and message", () => {
    const err = new AuthenticationError("Auth failed");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.name).toBe("AuthenticationError");
    expect(err.message).toBe("Auth failed");
  });

  it("should create a ForbiddenError with correct name and message", () => {
    const err = new ForbiddenError("Forbidden");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ForbiddenError);
    expect(err.name).toBe("ForbiddenError");
    expect(err.message).toBe("Forbidden");
  });

  it("should create a UserInputError with correct name and message", () => {
    const err = new UserInputError("Invalid input");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(UserInputError);
    expect(err.name).toBe("UserInputError");
    expect(err.message).toBe("Invalid input");
  });
});
