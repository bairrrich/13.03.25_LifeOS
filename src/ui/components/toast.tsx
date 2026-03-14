'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const variants = {
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900 dark:border-green-700 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900 dark:border-red-700 dark:text-red-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100',
};

export function Toast({ notification, onDismiss }: ToastProps) {
  React.useEffect(() => {
    if (notification.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-[400px] animate-in slide-in-from-right',
        variants[notification.type]
      )}
    >
      <span className="text-xl">{icons[notification.type]}</span>
      <div className="flex-1">
        {notification.title && (
          <p className="font-semibold text-sm">{notification.title}</p>
        )}
        {notification.message && (
          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
