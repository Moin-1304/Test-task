import mongoose from "mongoose";

// Employee schema
const employeeSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    class: {
      type: String,
      enum: ["Senior", "Mid-level", "Junior", "Intern"],
    },
    attendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    subjects: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    education: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    performance: {
      type: Number,
      min: 0,
      max: 10,
      default: 7,
    },
    notes: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
employeeSchema.index({
  name: "text",
  email: "text",
  department: "text",
  position: "text",
  class: "text",
});

// Create Employee model
const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
