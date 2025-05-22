import { Building2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ 
  className, 
  size = 'md',
  showText = true 
}: LogoProps) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  
  return (
    <div className={cn('flex items-center', className)}>
      <Building2 className={cn('text-primary-600', sizes[size])} />
      {showText && (
        <span className={cn('ml-2 font-semibold text-gray-900', textSizes[size])}>
          StaffSync
        </span>
      )}
    </div>
  );
};

export default Logo;