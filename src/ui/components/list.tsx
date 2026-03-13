import * as React from 'react';
import { cn } from '@/shared/lib/cn';

export interface ListItemProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  children,
  title,
  description,
  icon: Icon,
  action,
  onClick,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors',
        onClick && 'cursor-pointer hover:bg-accent',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export interface ListProps {
  children: React.ReactNode;
  className?: string;
}

export function List({ children, className }: ListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}
