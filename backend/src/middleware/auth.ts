import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/User.js";

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Verify JWT token and extract user
 * @param token JWT token
 * @returns User object if token is valid, null otherwise
 */
export const verifyToken = async (
  token: string
): Promise<{
  id: string;
  name: string;
  email: string;
  role: string;
} | null> => {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      user?: { id: string };
    };

    // Check if user exists
    const user = decoded.user?.id
      ? ((await User.findById(decoded.user.id)) as UserDocument)
      : null;
    if (!user) {
      return null;
    }

    // Return user info
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
};
