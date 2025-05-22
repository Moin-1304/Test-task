import Employee from '../models/Employee.js';
import { AuthenticationError } from '../utils/errors.js';

const dashboardResolvers = {
  Query: {
    // Get dashboard statistics
    dashboardStats: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      // Total employees
      const totalEmployees = await Employee.countDocuments();
      
      // New employees in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newEmployees = await Employee.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      // Average attendance rate
      const attendanceResult = await Employee.aggregate([
        {
          $group: {
            _id: null,
            avgAttendance: { $avg: '$attendance' }
          }
        }
      ]);
      const attendanceRate = attendanceResult.length > 0 ? 
        Math.round(attendanceResult[0].avgAttendance * 100) / 100 : 0;
      
      // Count of departments
      const departmentsResult = await Employee.aggregate([
        {
          $group: {
            _id: '$department'
          }
        },
        {
          $match: {
            _id: { $ne: null }
          }
        }
      ]);
      const departmentsCount = departmentsResult.length;
      
      return {
        totalEmployees,
        newEmployees,
        attendanceRate,
        departmentsCount
      };
    },
  },
};

export default dashboardResolvers;