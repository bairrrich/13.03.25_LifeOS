import * as React from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/ui/components/button';
import { X } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  size?: 'sm' | 'md';
  onRemove?: () => void;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    success: 'bg-success text-primary-foreground',
    warning: 'bg-warning text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    info: 'bg-info text-primary-foreground',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="rounded-full p-0.5 hover:bg-black/10"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
