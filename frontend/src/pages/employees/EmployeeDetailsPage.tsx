import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  ArrowLeft,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  School,
  Book,
  Edit,
  MoreHorizontal,
  Building,
  MapPin,
  Flag,
  Trash2,
  Award,
  FileText,
  Loader2,
  Users,
  HeartPulse,
} from "lucide-react";
import toast from "react-hot-toast";
import { EditEmployeeModal } from "./edit-employee-modal";
import { cn } from "../../utils/cn";
import { GET_EMPLOYEE, DELETE_EMPLOYEE } from "@/utils/mutations";
import { Employee } from "../../types/employee";
import { EMPLOYEE_TABS } from "../../constants/employee";
import InfoItem from "../../components/common/InfoItem";
import { useAuth } from "@/hooks/useAuth";
const EmployeeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch employee data
  const { loading, data, refetch } = useQuery(GET_EMPLOYEE, {
    variables: { id },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch employee details");
      navigate("/employees");
    },
  });
  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE);

  const employee = data?.getEmployee as Employee | undefined;

  // Action menu for options
  const ActionMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleAction = async (action: string) => {
      setIsOpen(false);

      switch (action) {
        case "edit":
          setIsEditModalOpen(true);
          break;
        case "flag":
          toast.success("Employee flagged successfully");
          break;
        case "delete":
          try {
            const { data } = await deleteEmployeeMutation({
              variables: { id },
            });
            if (data.deleteEmployee) {
              navigate("/employees");
              toast.success("Employee deleted successfully");
            }
          } catch (error) {
            toast.error("Error deleting employee");
          }
          break;

        default:
          break;
      }
    };

    return (
      <div className="relative">
        {
          user?.role === "ADMIN" && (
            <button
              onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
            <button
              onClick={() => handleAction("edit")}
              className="menu-item w-full text-left flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => handleAction("flag")}
              className="menu-item w-full text-left flex items-center"
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag
            </button>
            <button
              onClick={() => handleAction("delete")}
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

  const handleEmployeeUpdate = () => {
    refetch(); // Refresh the employee data after update
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Employee not found
          </h2>
          <p className="mt-2 text-gray-500">
            The employee you're looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/employees")}
            className="mt-4 btn-primary"
          >
            Go back to employees
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <EditEmployeeModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        // @ts-ignore
        employee={employee}
        onSubmit={handleEmployeeUpdate}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/employees")}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to employees</span>
          </button>
          <ActionMenu />
        </div>

        {/* Employee header */}
        <div className="bg-white shadow-card rounded-lg overflow-hidden mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-16"></div>
          <div className="px-6 py-6 flex flex-col md:flex-row">
            <div className="flex-shrink-0 -mt-16 md:-mt-24">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full ring-4 ring-white bg-white overflow-hidden">
                {employee.profileImage ? (
                  <img
                    src={employee.profileImage}
                    alt={employee.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-700">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {employee.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {employee.position} • {employee.department}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Active
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                    {employee.class}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {employee.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(employee.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              {EMPLOYEE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap",
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="md:col-span-1 space-y-8">
            {/* Basic Info Card */}
            <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <InfoItem
                  icon={Calendar}
                  label="Age"
                  value={`${employee.age} years`}
                />
                <InfoItem
                  icon={Building}
                  label="Department"
                  value={employee.department}
                />
                <InfoItem
                  icon={Briefcase}
                  label="Position"
                  value={employee.position}
                />
                <InfoItem icon={School} label="Class" value={employee.class} />
                <InfoItem
                  icon={Book}
                  label="Subjects"
                  value={employee.subjects}
                />
                <InfoItem
                  icon={MapPin}
                  label="Address"
                  // @ts-ignore
                  value={employee.address}
                />
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {employee.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary-50 px-3 py-0.5 text-sm font-medium text-primary-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column (main content) */}
          <div className="md:col-span-2 space-y-8">
            {activeTab === "overview" && (
              <>
                {/* Bio section */}
                <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-gray-700">{employee.bio}</p>
                </div>

                {/* Education section */}
                <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Education
                  </h2>
                  <ul className="space-y-4">
                    {employee.education?.map((edu, index) => (
                      <li key={index} className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-100 text-primary-600">
                            <Award className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {edu}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
                  <div className="bg-white shadow-card rounded-lg p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-primary-100 text-primary-600">
                        <HeartPulse className="h-6 w-6" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Attendance Rate
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {employee.attendance}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow-card rounded-lg p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-success-100 text-success-600">
                        <Award className="h-6 w-6" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Performance
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {employee.performance}/10
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow-card rounded-lg p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-accent-100 text-accent-600">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Team Size
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              5 members
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "performance" && (
              <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Performance Review
                </h2>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Rating
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {employee.performance}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      // @ts-ignore
                      style={{ width: `${employee?.performance * 10}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Performance details will be displayed here. This section
                  includes detailed performance metrics, feedback from managers,
                  and historical performance data.
                </p>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    Recent Feedback
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Quarterly Review
                        </span>
                        <span className="text-xs text-gray-500">
                          2 months ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {employee.name} has shown exceptional progress in the
                        last quarter. Their ability to collaborate with team
                        members and deliver high-quality work has been
                        outstanding.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Project Assessment
                        </span>
                        <span className="text-xs text-gray-500">
                          4 months ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Successfully led the team through a challenging project.
                        Demonstrated excellent problem-solving skills and
                        maintained high standards throughout the project
                        lifecycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Attendance Records
                  </h2>
                  <div className="text-sm text-gray-500">
                    Current Rate:{" "}
                    <span className="font-medium text-gray-900">
                      {employee.attendance}%
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full",
                        employee.attendance >= 90
                          ? "bg-success-500"
                          : employee.attendance >= 75
                          ? "bg-warning-500"
                          : "bg-error-500"
                      )}
                      style={{ width: `${employee.attendance}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Check In
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Check Out
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample attendance records */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-06-01
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Present
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          8:58 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5:05 PM
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-05-31
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Present
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          9:02 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5:15 PM
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-05-30
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Late
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          9:30 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5:45 PM
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-05-29
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Absent
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          -
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-05-28
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Present
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          8:55 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5:02 PM
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <button className="text-sm text-primary-600 hover:text-primary-500">
                    Load more records
                  </button>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Documents
                  </h2>
                  <button className="btn-primary text-sm">Upload new</button>
                </div>

                <div className="space-y-4">
                  {/* Sample documents */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-2 rounded bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Employment Contract
                      </h3>
                      <p className="text-xs text-gray-500">
                        PDF • 2.3 MB • Uploaded 1 year ago
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Download
                    </button>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-2 rounded bg-green-100">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Performance Review 2024
                      </h3>
                      <p className="text-xs text-gray-500">
                        DOCX • 1.5 MB • Uploaded 6 months ago
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Download
                    </button>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-2 rounded bg-purple-100">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Resume
                      </h3>
                      <p className="text-xs text-gray-500">
                        PDF • 985 KB • Uploaded 1 year ago
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Download
                    </button>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 p-2 rounded bg-orange-100">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Certificates
                      </h3>
                      <p className="text-xs text-gray-500">
                        ZIP • 4.7 MB • Uploaded 8 months ago
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="bg-white shadow-card rounded-lg p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Notes</h2>
                  <button className="btn-primary text-sm">Add note</button>
                </div>

                <div className="border rounded-lg p-4 mb-6">
                  <textarea
                    className="w-full min-h-[100px] border-0 focus:ring-0 text-sm"
                    placeholder="Add a note about this employee..."
                    defaultValue={employee.notes}
                  ></textarea>
                </div>

                <div className="space-y-4">
                  {/* Sample notes */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Meeting Notes
                      </span>
                      <span className="text-xs text-gray-500">
                        Added by Admin • 2 weeks ago
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Discussed career growth plans. {employee.name} is
                      interested in taking on more leadership responsibilities
                      and would like to be considered for the team lead position
                      when it becomes available.
                    </p>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-xs flex items-center text-gray-500 hover:text-gray-700">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button className="text-xs flex items-center text-error-600 hover:text-error-800">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Performance Feedback
                      </span>
                      <span className="text-xs text-gray-500">
                        Added by Manager • 1 month ago
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {employee.name} has been consistently delivering
                      high-quality work. Their recent project was completed
                      ahead of schedule and exceeded expectations. Consider for
                      a performance bonus this quarter.
                    </p>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-xs flex items-center text-gray-500 hover:text-gray-700">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button className="text-xs flex items-center text-error-600 hover:text-error-800">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
