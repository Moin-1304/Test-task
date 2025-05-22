# Employee Management System

A comprehensive web application for managing employee data with a beautiful UI and robust GraphQL backend.

## Features

- **Dual-view display system**: Grid and tile views for employee data
- **Interactive UI**: Hamburger menu, horizontal navigation, and expandable employee details
- **Complete GraphQL API**: CRUD operations for employee management
- **Role-based authentication**: Admin and employee access levels
- **Responsive design**: Optimized for all device sizes
- **Pagination and sorting**: Efficient data navigation
- **Context menu**: Edit, delete, and flag options for employee records

## Technologies Used

### Frontend
- React
- TypeScript
- Apollo Client (GraphQL)
- Tailwind CSS
- Lucide Icons
- React Router

### Backend
- Node.js
- Express
- GraphQL (Apollo Server)
- MongoDB (Mongoose)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/employee-management-system.git
cd employee-management-system
```

2. Install dependencies:
```
npm run install:all
```

3. Create a `.env` file in the backend directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

4. Start the development servers:
```
npm run dev
```

## Project Structure

```
/
├── frontend/              # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
├── backend/               # Backend Node.js application
│   ├── src/
│   │   ├── models/        # Data models
│   │   ├── resolvers/     # GraphQL resolvers
│   │   ├── schema/        # GraphQL schema
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
```

## API Documentation

The GraphQL API provides the following operations:

### Queries
- `me`: Get current user
- `getEmployees`: Get paginated, filtered, and sorted employees
- `getEmployee`: Get a single employee by ID
- `dashboardStats`: Get dashboard statistics

### Mutations
- `register`: Register a new user
- `login`: Login a user
- `updateProfile`: Update user profile
- `changePassword`: Change user password
- `createEmployee`: Create a new employee
- `updateEmployee`: Update an employee
- `deleteEmployee`: Delete an employee

## License

This project is licensed under the MIT License.