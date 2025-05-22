import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

// GraphQL mutation
const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
    }
  }
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });
  const [passwordError, setPasswordError] = useState("");

  // Register mutation
  const [registerMutation, { loading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      const { token } = data.register;
      login(token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear password error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    registerMutation({
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      },
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create your account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input pl-10"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input pl-10"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={`input pl-10 ${
                passwordError
                  ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                  : ""
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className="text-xs mt-1 text-gray-500">
            Password must be at least 8 characters
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={`input pl-10 ${
                passwordError
                  ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                  : ""
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {passwordError && (
            <p className="text-xs mt-1 text-error-600">{passwordError}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="label">
            Select Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              className="input pl-3 pr-10"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;