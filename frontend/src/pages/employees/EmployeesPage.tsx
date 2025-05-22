import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { 
  Search, UserPlus, GridIcon, LayoutList, 
  Filter, ChevronDown, MoreHorizontal, Edit, Flag, Trash2, 
  SortAsc, SortDesc, Loader2,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { AddEmployeeModal } from "./employee-modal";

// GraphQL query to fetch employees with filtering, sorting and pagination
const GET_EMPLOYEES = gql`
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

// Employee interface
interface Employee {
  id: string;
  name: string;
  email: string;
  age: number;
  class: string;
  attendance: number;
  subjects: string[];
  department: string;
  position: string;
  joinDate: string;
  profileImage?: string;
}

// View type
type ViewType = 'grid' | 'list';

const EmployeesPage = () => {
  // State for view, filtering, sorting and pagination
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    class: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(isModalOpen,'1111')
  
  // Options for filters and sorting
  const departments = ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR'];
  const classes = ['Senior', 'Mid-level', 'Junior', 'Intern'];
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'age', label: 'Age' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'joinDate', label: 'Join Date' }
  ];
  
  // Fetch employees data
  const { loading, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      page,
      limit: 12,
      filter: {
        search: searchTerm,
        department: filters.department || undefined,
        class: filters.class || undefined
      },
      sortBy,
      sortOrder
    },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch employees');
    }
  });
  
  // Extract data
  const employees = data?.getEmployees.employees || [];
  const totalPages = data?.getEmployees.totalPages || 0;

  const handleAddEmployee = (data: any) => {
    // In a real app, you would submit this data to your API
    console.log("Adding employee:", data);

    // Example of how you might call a mutation
    // addEmployeeMutation({ variables: { input: data } })

    // Show success message
    alert("Employee added successfully!");
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
  };
  
  // Apply filters
  const applyFilters = () => {
    setPage(1);
    refetch();
    setFilterOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      department: '',
      class: ''
    });
    setPage(1);
    refetch();
    setFilterOpen(false);
  };
  
  // Action menu for employee cards/rows
  const ActionMenu = ({ }: { id: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleAction = (action: string) => {
      setIsOpen(false);
      
      switch (action) {
        case 'edit':
          toast.success('Edit feature coming soon');
          break;
        case 'flag':
          toast.success('Employee flagged successfully');
          break;
        case 'delete':
          toast.success('Delete feature coming soon');
          break;
        default:
          break;
      }
    };
    
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
        
        {isOpen && (
          <div
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
          >
            <button
              onClick={() => handleAction('edit')}
              className="menu-item w-full text-left flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => handleAction('flag')}
              className="menu-item w-full text-left flex items-center"
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag
            </button>
            <button
              onClick={() => handleAction('delete')}
              className="menu-item w-full text-left flex items-center text-error-600 hover:text-error-800 hover:bg-error-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Grid view - Employee card component
  const EmployeeCard = ({ employee }: { employee: Employee }) => {
    return (
      <Link
        to={`/employees/${employee.id}`}
        className="card card-hover p-5 transition-all duration-200 group animate-fade-in"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={employee.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-700 font-semibold text-lg">
                  {employee.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
          </div>
          <ActionMenu id={employee.id} />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Department</p>
            <p className="text-sm font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Class</p>
            <p className="text-sm font-medium">{employee.class}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Attendance</p>
            <p className="text-sm font-medium">{employee.attendance}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Subjects</p>
            <p className="text-sm font-medium truncate">
              {employee.subjects?.join(', ')}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm">{employee.email}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  };
  
  // List view - Table row component
  const EmployeeRow = ({ employee }: { employee: Employee }) => {
    return (
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => window.location.href = `/employees/${employee.id}`}
      >
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={employee.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">
                    {employee.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">{employee.name}</div>
              <div className="text-gray-500">{employee.email}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {employee.department}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {employee.position}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {employee.class}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {employee.attendance}%
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <ActionMenu id={employee.id} />
        </td>
      </tr>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all employees in your organization including their
            details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="btn-primary flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add employee
          </button>
          <AddEmployeeModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddEmployee}
          />
        </div>
      </div>

      {/* Filters and controls */}
      <div className="mt-6 md:flex md:items-center md:justify-between border-b border-gray-200 pb-5">
        <div className="flex-1 min-w-0">
          <div className="relative max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="input pl-10"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && refetch()}
            />
          </div>
        </div>

        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              type="button"
              className="btn-ghost flex items-center"
              onClick={toggleSortOrder}
            >
              {sortOrder === "ASC" ? (
                <SortAsc className="h-4 w-4 mr-1" />
              ) : (
                <SortDesc className="h-4 w-4 mr-1" />
              )}
              Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    refetch();
                  }}
                  className="menu-item w-full text-left"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter button */}
          <div className="relative">
            <button
              type="button"
              className="btn-ghost flex items-center"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Filters
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="department" className="label">
                        Department
                      </label>
                      <select
                        id="department"
                        className="input"
                        value={filters.department}
                        onChange={(e) =>
                          setFilters({ ...filters, department: e.target.value })
                        }
                      >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="class" className="label">
                        Class
                      </label>
                      <select
                        id="class"
                        className="input"
                        value={filters.class}
                        onChange={(e) =>
                          setFilters({ ...filters, class: e.target.value })
                        }
                      >
                        <option value="">All Classes</option>
                        {classes.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="btn-ghost text-sm"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn-primary text-sm"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center rounded-md shadow-sm border border-gray-300 divide-x divide-gray-300">
            <button
              type="button"
              className={cn(
                "relative inline-flex items-center px-3 py-2 text-sm font-medium focus:z-10 focus:outline-none",
                viewType === "grid"
                  ? "bg-primary-50 text-primary-700"
                  : "bg-white text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setViewType("grid")}
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={cn(
                "relative inline-flex items-center px-3 py-2 text-sm font-medium focus:z-10 focus:outline-none",
                viewType === "list"
                  ? "bg-primary-50 text-primary-700"
                  : "bg-white text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setViewType("list")}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      )}

      {/* Employees grid view */}
      {viewType === "grid" && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {employees.map((employee: Employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}

          {employees.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Users className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No employees found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Employees list view */}
      {viewType === "list" && (
        <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Class
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Attendance
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {employees.map((employee: Employee) => (
                <EmployeeRow key={employee.id} employee={employee} />
              ))}

              {employees.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Users className="h-10 w-10 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No employees found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={cn(
                        "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                        pageNumber === page
                          ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {pageNumber}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;