'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/ui/components/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    const showStart = currentPage <= 3;
    const showEnd = currentPage >= totalPages - 2;
    const showMiddle = !showStart && !showEnd;

    if (showStart) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        result.push(i);
      }
      if (totalPages > 5) {
        result.push('ellipsis');
        result.push(totalPages);
      }
    } else if (showEnd) {
      result.push(1);
      result.push('ellipsis');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      result.push(1);
      result.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        result.push(i);
      }
      result.push('ellipsis');
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn('flex items-center justify-center gap-1', className)}
      role="navigation"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
