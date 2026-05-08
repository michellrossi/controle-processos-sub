import { StatusType, STATUS_COLORS } from '@/types/processo';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = STATUS_COLORS[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-[11px]',
    lg: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'status-badge inline-flex items-center',
        config.badge,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}

