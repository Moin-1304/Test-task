import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash, Calendar } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  age: number;
  class: string;
  attendance: number;
  subjects: string[];
  department: string;
  position: string;
  joinDate: string;
  address: string;
  bio: string;
  education: string[];
  skills: string[];
  performance: number;
  notes: string;
  profileImage: string;
}

const CREATE_EMPLOYEE = gql`
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

export function AddEmployeeModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    age: 25,
    class: "",
    attendance: 100,
    subjects: [],
    department: "",
    position: "",
    joinDate: new Date().toISOString().split("T")[0],
    address: "",
    bio: "",
    education: [],
    skills: [],
    performance: 7,
    notes: "",
    profileImage: "",
  });

  const [newSubject, setNewSubject] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleChange = (field: keyof EmployeeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addItem = (
    field: "subjects" | "education" | "skills",
    value: string,
    setter: (val: string) => void
  ) => {
    if (!value.trim()) return;

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setter("");
  };

  const removeItem = (
    field: "subjects" | "education" | "skills",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (formData.age < 18 || formData.age > 100)
      newErrors.age = "Age must be between 18 and 100";
    if (!formData.class) newErrors.class = "Class is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const { data } = await createEmployee({
          variables: { input: formData },
        });

        if (data?.createEmployee) {
          toast.success("Employee created successfully");
          onClose();
          navigate("/employees");
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to create employee");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transform transition-all duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-5 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium ${
                      errors.name
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter employee name"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "focus:ring-red-500"
                        : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    } focus:border-transparent transition-shadow duration-200`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${
                      errors.email
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="email@example.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "focus:ring-red-500"
                        : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    } focus:border-transparent transition-shadow duration-200`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(123) 456-7890"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className={`block text-sm font-medium ${
                      errors.age
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age"
                    type="number"
                    min={18}
                    max={100}
                    value={formData.age}
                    onChange={(e) =>
                      handleChange("age", Number.parseInt(e.target.value) || 18)
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.age
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.age
                        ? "focus:ring-red-500"
                        : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    } focus:border-transparent transition-shadow duration-200`}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500 mt-1">{errors.age}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-5 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-emerald-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Employment Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="class"
                    className={`block text-sm font-medium ${
                      errors.class
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="class"
                    value={formData.class}
                    onChange={(e) => handleChange("class", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.class
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.class
                        ? "focus:ring-red-500"
                        : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    } focus:border-transparent transition-shadow duration-200 appearance-none`}
                  >
                    <option value="">Select class</option>
                    <option value="Senior">Senior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Junior">Junior</option>
                    <option value="Intern">Intern</option>
                  </select>
                  {errors.class && (
                    <p className="text-sm text-red-500 mt-1">{errors.class}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="department"
                    className={`block text-sm font-medium ${
                      errors.department
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="department"
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    placeholder="Enter department"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.department
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.department
                        ? "focus:ring-red-500"
                        : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    } focus:border-transparent transition-shadow duration-200`}
                  />
                  {errors.department && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="position"
                    className={`block text-sm font-medium ${
                      errors.position
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    placeholder="Enter position"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.position
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.position
                        ? "focus:ring-red-500"
                        : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    } focus:border-transparent transition-shadow duration-200`}
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.position}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="joinDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Join Date
                  </label>
                  <div className="relative">
                    <input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => handleChange("joinDate", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                    />
                    <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-5 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-amber-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Metrics
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="attendance"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Attendance
                    </label>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {formData.attendance}%
                    </span>
                  </div>
                  <input
                    id="attendance"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={formData.attendance}
                    onChange={(e) =>
                      handleChange("attendance", Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400 dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="performance"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Performance Rating
                    </label>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {formData.performance}/10
                    </span>
                  </div>
                  <input
                    id="performance"
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={formData.performance}
                    onChange={(e) =>
                      handleChange("performance", Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400 dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Subjects
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add a subject"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem("subjects", newSubject, setNewSubject);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addItem("subjects", newSubject, setNewSubject)}
                  className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Add subject"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeItem("subjects", index)}
                      className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full text-blue-600 dark:text-blue-300 hover:bg-blue-200 hover:text-blue-800 dark:hover:bg-blue-800 dark:hover:text-blue-100 focus:outline-none transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.subjects.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No subjects added
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-green-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Skills
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem("skills", newSkill, setNewSkill);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addItem("skills", newSkill, setNewSkill)}
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Add skill"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeItem("skills", index)}
                      className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full text-green-600 dark:text-green-300 hover:bg-green-200 hover:text-green-800 dark:hover:bg-green-800 dark:hover:text-green-100 focus:outline-none transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No skills added
                  </p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-5 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Education
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Add education (e.g., 'BS Computer Science, XYZ University')"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem("education", newEducation, setNewEducation);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    addItem("education", newEducation, setNewEducation)
                  }
                  className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Add education"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200"
                  >
                    <span className="text-gray-800 dark:text-gray-200">
                      {edu}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem("education", index)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors duration-200"
                      aria-label="Remove education"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.education.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    No education history added
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-5 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-pink-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Additional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Street address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Profile Image URL
                  </label>
                  <input
                    id="profileImage"
                    type="text"
                    value={formData.profileImage}
                    onChange={(e) =>
                      handleChange("profileImage", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Brief description about the employee"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200 resize-y"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Additional notes or comments"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow duration-200 resize-y"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 font-medium shadow-sm"
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
