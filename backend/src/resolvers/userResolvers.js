import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { Role } from '../models/User.js';
import { AuthenticationError, ForbiddenError, UserInputError } from '../utils/errors.js';

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userResolvers = {
  Query: {
    // Get current user
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const foundUser = await User.findById(user.id);
      if (!foundUser) {
        throw new AuthenticationError('User not found');
      }
      
      return {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        createdAt: foundUser.createdAt?.toISOString(),
        updatedAt: foundUser.updatedAt?.toISOString(),
      };
    },
  },
  
  Mutation: {
    // Register a new user
    register: async (_, { input }) => {
      const { name, email, password, role } = input;
      
      // Check if email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new UserInputError('Email already exists');
      }
      
      // Create new user
      const user = new User({
        name,
        email,
        password,
        role: role || Role.EMPLOYEE,
      });
      
      await user.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email,
            role: user.role 
          } 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return { token };
    },
    
    // Login user
    login: async (_, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError('Invalid email or password');
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new UserInputError('Invalid email or password');
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email,
            role: user.role 
          } 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return { token };
    },
    
    // Update user profile
    updateProfile: async (_, { input }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const { name, email } = input;
      
      // Check if email is already in use if trying to change email
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: user.id } });
        if (existingUser) {
          throw new UserInputError('Email already exists');
        }
      }
      
      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { 
          name: name || undefined, 
          email: email || undefined 
        },
        { new: true }
      );
      
      if (!updatedUser) {
        throw new UserInputError('User not found');
      }
      
      return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt?.toISOString(),
        updatedAt: updatedUser.updatedAt?.toISOString(),
      };
    },
    
    // Change password
    changePassword: async (
      _, 
      { currentPassword, newPassword },
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Find user
      const foundUser = await User.findById(user.id);
      if (!foundUser) {
        throw new UserInputError('User not found');
      }
      
      // Check current password
      const isMatch = await foundUser.comparePassword(currentPassword);
      if (!isMatch) {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        return {
          success: false,
          message: 'New password must be at least 8 characters',
        };
      }
      
      // Update password
      foundUser.password = newPassword;
      await foundUser.save();
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    },
  },
};

export default userResolvers;