import Employee from '../models/Employee.js';
import { AuthenticationError, ForbiddenError, UserInputError } from '../utils/errors.js';
import { Role } from '../models/User.js';

const employeeResolvers = {
  Query: {
    getEmployees: async (
      _,
      { 
        page = 1, 
        limit = 10, 
        filter = {}, 
        sortBy = 'name', 
        sortOrder = 'ASC' 
      },
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Build filter object
      const filterObj = {};
      
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
        if (filter.minAttendance) filterObj.attendance.$gte = filter.minAttendance;
        if (filter.maxAttendance) filterObj.attendance.$lte = filter.maxAttendance;
      }
      
      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'ASC' ? 1 : -1;
      
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
        employees: employees.map(employee => ({
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
    getEmployee: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new UserInputError('Employee not found');
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
    createEmployee: async (_, { input }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Only admins can create employees
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenError('Not authorized to create employees');
      }
      
      // Check if email is already in use
      const existingEmployee = await Employee.findOne({ email: input.email });
      if (existingEmployee) {
        throw new UserInputError('Email is already in use');
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
      _, 
      { id, input }, 
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Only admins can update employees
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenError('Not authorized to update employees');
      }
      
      // Check if email is already in use
      if (input.email) {
        const existingEmployee = await Employee.findOne({ 
          email: input.email,
          _id: { $ne: id }
        });
        
        if (existingEmployee) {
          throw new UserInputError('Email is already in use');
        }
      }
      
      // Update employee
      const employee = await Employee.findByIdAndUpdate(id, input, { new: true });
      if (!employee) {
        throw new UserInputError('Employee not found');
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
    deleteEmployee: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Only admins can delete employees
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenError('Not authorized to delete employees');
      }
      
      // Delete employee
      const result = await Employee.findByIdAndDelete(id);
      if (!result) {
        throw new UserInputError('Employee not found');
      }
      
      return true;
    },
  },
};

export default employeeResolvers;