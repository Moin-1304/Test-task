import React from "react";
import { InfoItemProps } from "../../types/common";

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => {
  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900">{displayValue}</p>
      </div>
    </div>
  );
};

export default InfoItem;
