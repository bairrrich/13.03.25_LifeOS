'use client';

import * as React from 'react';
import { notificationService } from '@/core/notifications';
import type { Notification } from '@/core/notifications';

interface ToasterContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  dismissNotification: (id: string) => void;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined);

export function useToaster() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast, toast, ToastContainer: Container } = useToast();
  const [, setNotifications] = React.useState<Notification[]>([]);

  // Подписка на уведомления из notification service
  React.useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const notification = customEvent.detail as {
        type: 'info' | 'success' | 'warning' | 'error';
        title: string;
        message: string;
        autoClose?: number;
      };

      const typeMap = {
        info: toast.info,
        success: toast.success,
        warning: toast.warning,
        error: toast.error,
      };

      typeMap[notification.type](
        notification.title,
        notification.message,
        notification.autoClose
      );
    };

    window.addEventListener('lifeos-toast', handleToast);
    return () => window.removeEventListener('lifeos-toast', handleToast);
  }, [toast]);

  const addNotification = React.useCallback((notification: Omit<Notification, 'id'>) => {
    return notificationService.create(notification as never);
  }, []);

  const dismissNotification = React.useCallback((id: string) => {
    notificationService.dismiss(id);
  }, []);

  return (
    <ToasterContext.Provider
      value={{ notifications: [], addNotification, dismissNotification, success: () => '', error: () => '', warning: () => '', info: () => '' }}
    >
      {children}
      <Container />
    </ToasterContext.Provider>
  );
}
