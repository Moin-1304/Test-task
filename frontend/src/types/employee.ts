// Employee type for list and details
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  class: string;
  attendance: number;
  subjects: string[];
  department: string;
  position: string;
  joinDate: string;
  address?: string;
  bio?: string;
  education?: string[];
  skills?: string[];
  performance?: number;
  notes?: string;
  profileImage?: string;
}

// Employee form data for create/edit modals
export interface EmployeeFormData extends Omit<Employee, "id"> {
  id?: string;
}

// View type for employee list
export type ViewType = "grid" | "list";
