import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";

describe("AuthProvider", () => {
  it("provides default values when not logged in", () => {
    let contextValue: any;
    function TestComponent() {
      contextValue = useContext(AuthContext);
      return null;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(false);
    expect(contextValue.loading).toBe(false);
  });

  it("login sets user and isAuthenticated", async () => {
    let contextValue: any;
    function TestComponent() {
      contextValue = useContext(AuthContext);
      return null;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    // Simulate login with a fake token
    const fakeToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9." +
      "eyJ1c2VyIjp7ImlkIjoiMSIsIm5hbWUiOiJUZXN0IFVzZXIifX0." +
      "signature";
    await act(async () => {
      contextValue.login(fakeToken);
    });
    await waitFor(() => {
      expect(contextValue.isAuthenticated).toBe(true);
      expect(contextValue.user).toBeTruthy();
    });
  });

  it("logout clears user and isAuthenticated", async () => {
    let contextValue: any;
    function TestComponent() {
      contextValue = useContext(AuthContext);
      return null;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    // Simulate login then logout
    const fakeToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9." +
      "eyJ1c2VyIjp7ImlkIjoiMSIsIm5hbWUiOiJUZXN0IFVzZXIifX0." +
      "signature";
    await act(async () => {
      contextValue.login(fakeToken);
      contextValue.logout();
    });
    await waitFor(() => {
      expect(contextValue.isAuthenticated).toBe(false);
      expect(contextValue.user).toBeNull();
    });
  });
});
