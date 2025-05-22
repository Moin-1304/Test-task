import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Verify JWT token and extract user
 * @param token JWT token
 * @returns User object if token is valid, null otherwise
 */
export const verifyToken = async (token) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return null;
    }

    // Return user info
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
};
