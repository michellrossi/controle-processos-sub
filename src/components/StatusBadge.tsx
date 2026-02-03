import { StatusType, STATUS_COLORS } from '@/types/processo';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        colors.bg,
        colors.text,
        sizeClasses[size],
        className
      )}
    >
      {colors.label}
    </span>
  );
}
