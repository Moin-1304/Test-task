import React from "react";

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
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
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
        error
          ? "focus:ring-red-500"
          : "focus:ring-indigo-500 dark:focus:ring-indigo-400"
      } focus:border-transparent transition-shadow duration-200 resize-y ${
        props.className || ""
      }`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default TextAreaField;
