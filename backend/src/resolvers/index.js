import userResolvers from './userResolvers.js';
import employeeResolvers from './employeeResolvers.js';
import dashboardResolvers from './dashboardResolvers.js';

// Merge all resolvers
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...employeeResolvers.Query,
    ...dashboardResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...employeeResolvers.Mutation,
  },
};