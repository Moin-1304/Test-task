import mongoose, { Document, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

export const Role = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
};

// Define a TypeScript interface for the User document
export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.EMPLOYEE,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<UserDocument>(
  "save",
  async function (next: (err?: CallbackError) => void) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    try {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  }
);

// Method to check if password is correct
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
