import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerClassName = "",
  ...props
}) => (
  <div className={`space-y-2 ${containerClassName}`}>
    <label
      htmlFor={props.id}
      className={`block text-sm font-medium ${
        error ? "text-red-500" : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
        error
          ? "focus:ring-red-500"
          : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
      } focus:border-transparent transition-shadow duration-200 ${
        props.className || ""
      }`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default InputField;
