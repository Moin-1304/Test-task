import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { AuthProvider } from "../contexts/AuthContext";

describe("useAuth", () => {
  it.skip("throws error if used outside AuthProvider", () => {
    const { result } = renderHook(() => useAuth());
    let error;
    try {
      // Accessing current will throw
      // @ts-ignore
      result.current;
    } catch (e: any) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toBe("useAuth must be used within an AuthProvider");
  });

  it("returns context value inside AuthProvider", () => {
    const wrapper = ({ children }: any) => {
      return <AuthProvider>{children}</AuthProvider>;
    };
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toHaveProperty("login");
    expect(result.current).toHaveProperty("logout");
    expect(result.current).toHaveProperty("isAuthenticated");
  });
});
