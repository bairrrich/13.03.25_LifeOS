'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/cn';
import { X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}

const typeStyles = {
  info: {
    bg: 'bg-blue-500',
    border: 'border-blue-600',
    icon: 'ℹ️',
  },
  success: {
    bg: 'bg-green-500',
    border: 'border-green-600',
    icon: '✅',
  },
  warning: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-600',
    icon: '⚠️',
  },
  error: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    icon: '❌',
  },
};

export function Toast({ id, type, title, message, onClose, duration = 5000 }: ToastProps) {
  const [isExiting, setIsExiting] = React.useState(false);
  const style = typeStyles[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
        style.bg,
        'text-white',
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        'animate-slide-in-right'
      )}
      role="alert"
    >
      <span className="text-xl">{style.icon}</span>
      <div className="flex-1 space-y-1">
        <p className="font-semibold text-sm">{title}</p>
        {message && <p className="text-xs opacity-90">{message}</p>}
      </div>
      <button
        onClick={handleClose}
        className="rounded p-1 hover:bg-white/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Контейнер для Toast уведомлений
 */
export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
}

export function ToastContainer({
  toasts,
  onRemove,
  position = 'top-right',
  maxVisible = 5,
}: ToastContainerProps) {
  const visibleToasts = toasts.slice(0, maxVisible);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 p-4',
        positionClasses[position]
      )}
    >
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}

/**
 * Hook для управления toast уведомлениями
 */
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    duration?: number;
  }>>([]);

  const addToast = React.useCallback((
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substring(2, 15);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(() => ({
    info: (title: string, message?: string, duration?: number) =>
      addToast('info', title, message, duration),
    success: (title: string, message?: string, duration?: number) =>
      addToast('success', title, message, duration),
    warning: (title: string, message?: string, duration?: number) =>
      addToast('warning', title, message, duration),
    error: (title: string, message?: string, duration?: number) =>
      addToast('error', title, message, duration),
  }), [addToast]);

  return {
    toasts,
    removeToast,
    toast,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    ),
  };
}
