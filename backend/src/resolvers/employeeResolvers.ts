import Employee from "../models/Employee.js";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "../utils/errors.js";
import { Role } from "../models/User.js";

interface Context {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface EmployeeFilterInput {
  search?: string;
  department?: string;
  class?: string;
  minAge?: number;
  maxAge?: number;
  minAttendance?: number;
  maxAttendance?: number;
}

interface EmployeeInput {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  class?: string;
  attendance?: number;
  subjects?: string[];
  department?: string;
  position?: string;
  joinDate?: string;
  address?: string;
  bio?: string;
  education?: string[];
  skills?: string[];
  performance?: number;
  notes?: string;
  profileImage?: string;
}

type SortOrder = "ASC" | "DESC";

const employeeResolvers = {
  Query: {
    getEmployees: async (
      _: unknown,
      {
        page = 1,
        limit = 10,
        filter = {},
        sortBy = "name",
        sortOrder = "ASC",
      }: {
        page?: number;
        limit?: number;
        filter?: EmployeeFilterInput;
        sortBy?: string;
        sortOrder?: SortOrder;
      },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }

      // Build filter object
      const filterObj: any = {};

      // Text search
      if (filter.search) {
        filterObj.$text = { $search: filter.search };
      }

      // Department filter
      if (filter.department) {
        filterObj.department = filter.department;
      }

      // Class filter
      if (filter.class) {
        filterObj.class = filter.class;
      }

      // Age range filter
      if (filter.minAge || filter.maxAge) {
        filterObj.age = {};
        if (filter.minAge) filterObj.age.$gte = filter.minAge;
        if (filter.maxAge) filterObj.age.$lte = filter.maxAge;
      }

      // Attendance range filter
      if (filter.minAttendance || filter.maxAttendance) {
        filterObj.attendance = {};
        if (filter.minAttendance)
          filterObj.attendance.$gte = filter.minAttendance;
        if (filter.maxAttendance)
          filterObj.attendance.$lte = filter.maxAttendance;
      }

      // Build sort object
      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sortBy] = sortOrder === "ASC" ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await Employee.countDocuments(filterObj);
      const totalPages = Math.ceil(totalCount / limit);

      // Get employees
      const employees = await Employee.find(filterObj)
        .sort(sortObj)
        .skip(skip)
        .limit(limit);

      return {
        employees: employees.map((employee: any) => ({
          id: employee._id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          age: employee.age,
          class: employee.class,
          attendance: employee.attendance,
          subjects: employee.subjects,
          department: employee.department,
          position: employee.position,
          joinDate: employee.joinDate?.toISOString(),
          address: employee.address,
          bio: employee.bio,
          education: employee.education,
          skills: employee.skills,
          performance: employee.performance,
          notes: employee.notes,
          profileImage: employee.profileImage,
          createdAt: employee.createdAt?.toISOString(),
          updatedAt: employee.updatedAt?.toISOString(),
        })),
        totalCount,
        totalPages,
      };
    },

    // Get a single employee by ID
    getEmployee: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }

      const employee = await Employee.findById(id);
      if (!employee) {
        throw new UserInputError("Employee not found");
      }

      return {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        age: employee.age,
        class: employee.class,
        attendance: employee.attendance,
        subjects: employee.subjects,
        department: employee.department,
        position: employee.position,
        joinDate: employee.joinDate?.toISOString(),
        address: employee.address,
        bio: employee.bio,
        education: employee.education,
        skills: employee.skills,
        performance: employee.performance,
        notes: employee.notes,
        profileImage: employee.profileImage,
        createdAt: employee.createdAt?.toISOString(),
        updatedAt: employee.updatedAt?.toISOString(),
      };
    },
  },

  Mutation: {
    // Create a new employee
    createEmployee: async (
      _: unknown,
      { input }: { input: EmployeeInput },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }

      // Only admins can create employees
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenError("Not authorized to create employees");
      }

      // Check if email is already in use
      const existingEmployee = await Employee.findOne({ email: input.email });
      if (existingEmployee) {
        throw new UserInputError("Email is already in use");
      }

      // Create new employee
      const employee = new Employee(input);
      await employee.save();

      return {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        age: employee.age,
        class: employee.class,
        attendance: employee.attendance,
        subjects: employee.subjects,
        department: employee.department,
        position: employee.position,
        joinDate: employee.joinDate?.toISOString(),
        address: employee.address,
        bio: employee.bio,
        education: employee.education,
        skills: employee.skills,
        performance: employee.performance,
        notes: employee.notes,
        profileImage: employee.profileImage,
        createdAt: employee.createdAt?.toISOString(),
        updatedAt: employee.updatedAt?.toISOString(),
      };
    },

    // Update an employee
    updateEmployee: async (
      _: unknown,
      { id, input }: { id: string; input: EmployeeInput },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }

      // Only admins can update employees
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenError("Not authorized to update employees");
      }

      // Check if email is already in use
      if (input.email) {
        const existingEmployee = await Employee.findOne({
          email: input.email,
          _id: { $ne: id },
        });

        if (existingEmployee) {
          throw new UserInputError("Email is already in use");
        }
      }

      // Update employee
      const employee = await Employee.findByIdAndUpdate(id, input, {
        new: true,
      });
      if (!employee) {
        throw new UserInputError("Employee not found");
      }

      return {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        age: employee.age,
        class: employee.class,
        attendance: employee.attendance,
        subjects: employee.subjects,
        department: employee.department,
        position: employee.position,
        joinDate: employee.joinDate?.toISOString(),
        address: employee.address,
        bio: employee.bio,
        education: employee.education,
        skills: employee.skills,
        performance: employee.performance,
        notes: employee.notes,
        profileImage: employee.profileImage,
        createdAt: employee.createdAt?.toISOString(),
        updatedAt: employee.updatedAt?.toISOString(),
      };
    },

    // Delete an employee
    deleteEmployee: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }

      // Only admins can delete employees
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenError("Not authorized to delete employees");
      }

      // Delete employee
      const result = await Employee.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default employeeResolvers;
