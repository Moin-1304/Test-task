import React from "react";

interface SectionHeaderProps {
  colorClass: string; // e.g. "bg-indigo-600"
  children: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  colorClass,
  children,
}) => (
  <div className="flex items-center space-x-2">
    <div className={`h-8 w-1 ${colorClass} rounded-full`} />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {children}
    </h3>
  </div>
);

export default SectionHeader;
