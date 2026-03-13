import * as React from 'react';
import { cn } from '@/shared/lib/cn';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground',
        sizes[size],
        className
      )}
    >
      {fallback}
    </div>
  );
}
