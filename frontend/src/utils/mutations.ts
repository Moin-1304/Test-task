import { gql } from "@apollo/client";

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $page: Int
    $limit: Int
    $filter: EmployeeFilterInput
    $sortBy: String
    $sortOrder: SortOrder
  ) {
    getEmployees(
      page: $page
      limit: $limit
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      employees {
        id
        name
        email
        age
        class
        attendance
        subjects
        department
        position
        joinDate
        profileImage
      }
      totalCount
      totalPages
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      name
      email
      phone
      age
      class
      attendance
      subjects
      department
      position
      joinDate
      address
      bio
      education
      skills
      performance
      notes
      profileImage
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      name
      email
      phone
      age
      class
      attendance
      subjects
      department
      position
      joinDate
      address
      bio
      education
      skills
      performance
      notes
      profileImage
      createdAt
      updatedAt
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalEmployees
      newEmployees
      attendanceRate
      departmentsCount
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      email
      phone
      age
      class
      attendance
      subjects
      department
      position
      joinDate
      address
      bio
      education
      skills
      performance
      notes
      profileImage
      updatedAt
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;