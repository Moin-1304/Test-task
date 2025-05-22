// Props for the Logo component
export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

// Props for InfoItem reusable component
export interface InfoItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number | string[];
}
