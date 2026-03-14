'use client';

import * as React from 'react';
import { Toast, type Notification } from '@/ui/components/toast';

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
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = { id, ...notification };
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const dismissNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = React.useCallback(
    (title: string, message?: string) =>
      addNotification({ type: 'success', title, message }),
    [addNotification]
  );

  const error = React.useCallback(
    (title: string, message?: string) =>
      addNotification({ type: 'error', title, message }),
    [addNotification]
  );

  const warning = React.useCallback(
    (title: string, message?: string) =>
      addNotification({ type: 'warning', title, message }),
    [addNotification]
  );

  const info = React.useCallback(
    (title: string, message?: string) =>
      addNotification({ type: 'info', title, message }),
    [addNotification]
  );

  return (
    <ToasterContext.Provider
      value={{ notifications, addNotification, dismissNotification, success, error, warning, info }}
    >
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
          />
        ))}
      </div>
    </ToasterContext.Provider>
  );
}
