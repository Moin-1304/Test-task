import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash } from "lucide-react";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UPDATE_EMPLOYEE } from "@/utils/mutations";
import { EmployeeFormData } from "../../types/employee";
import InputField from "@/components/common/InputField";
import SelectField from "@/components/common/SelectField";
import TextAreaField from "@/components/common/TextAreaField";
import SectionHeader from "@/components/common/SectionHeader";

export function EditEmployeeModal({
  open,
  onClose,
  employee,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  employee: EmployeeFormData;
  onSubmit?: (data: EmployeeFormData) => void;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EmployeeFormData>({
    id: "",
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

  // Initialize form data with employee data when modal opens or employee changes
  useEffect(() => {
    if (employee && open) {
      setFormData({
        ...employee,
        // Ensure date format is correct
        joinDate: employee.joinDate
          ? employee.joinDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [employee, open]);

  const [newSubject, setNewSubject] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateEmployee, { loading }] = useMutation(UPDATE_EMPLOYEE);

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

    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setter("");
  };

  const removeItem = (
    field: "subjects" | "education" | "skills",
    index: number
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: any) => i !== index),
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
        const { data } = await updateEmployee({
          variables: {
            id: formData.id,
            input: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              age: formData.age,
              class: formData.class,
              attendance: formData.attendance,
              subjects: formData.subjects,
              department: formData.department,
              position: formData.position,
              joinDate: formData.joinDate,
              address: formData.address,
              bio: formData.bio,
              education: formData.education,
              skills: formData.skills,
              performance: formData.performance,
              notes: formData.notes,
              profileImage: formData.profileImage,
            },
          },
        });

        if (data?.updateEmployee) {
          toast.success("Employee updated successfully");
          onClose();

          // Call the onSubmit callback if provided
          if (onSubmit) {
            onSubmit(data.updateEmployee);
          }

          // Refresh the page to show updated data
          navigate(`/employees/${formData.id}`);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to update employee");
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
            Edit Employee
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
              <SectionHeader colorClass="bg-indigo-600">
                Basic Information
              </SectionHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <InputField
                    id="name"
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="age"
                    label="Age"
                    type="number"
                    min={18}
                    max={100}
                    value={formData.age}
                    onChange={(e) =>
                      handleChange("age", Number.parseInt(e.target.value) || 18)
                    }
                    error={errors.age}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-5 md:col-span-2">
              <SectionHeader colorClass="bg-emerald-600">
                Employment Details
              </SectionHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <SelectField
                    id="class"
                    label="Class"
                    value={formData.class}
                    onChange={(e) => handleChange("class", e.target.value)}
                    error={errors.class}
                    required
                    options={[
                      { value: "", label: "Select class" },
                      { value: "Senior", label: "Senior" },
                      { value: "Mid-level", label: "Mid-level" },
                      { value: "Junior", label: "Junior" },
                      { value: "Intern", label: "Intern" },
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="department"
                    label="Department"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    error={errors.department}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="position"
                    label="Position"
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    error={errors.position}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="joinDate"
                    label="Join Date"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleChange("joinDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-5 md:col-span-2">
              <SectionHeader colorClass="bg-amber-600">
                Performance Metrics
              </SectionHeader>

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
              <SectionHeader colorClass="bg-blue-600">Subjects</SectionHeader>

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
              <SectionHeader colorClass="bg-green-600">Skills</SectionHeader>

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
                {formData.skills?.map((skill, index) => (
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
                {formData.skills?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No skills added
                  </p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-5 md:col-span-2">
              <SectionHeader colorClass="bg-purple-600">
                Education
              </SectionHeader>

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
                {formData.education?.map((edu, index) => (
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
                {formData.education?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    No education history added
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-5 md:col-span-2">
              <SectionHeader colorClass="bg-pink-600">
                Additional Information
              </SectionHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <InputField
                    id="address"
                    label="Address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <InputField
                    id="profileImage"
                    label="Profile Image URL"
                    value={formData.profileImage}
                    disabled
                    onChange={(e) =>
                      handleChange("profileImage", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <TextAreaField
                    id="bio"
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <TextAreaField
                    id="notes"
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
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
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
