import * as React from 'react';
import { cn } from '@/shared/lib/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  variant = 'default',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const variants = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-secondary',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            variants[variant],
            sizes[size]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs text-muted-foreground">
          {percentage}%
        </div>
      )}
    </div>
  );
}
