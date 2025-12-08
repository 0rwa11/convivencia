import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  duration?: number;
}

interface EnhancedNotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const EnhancedNotificationContext = createContext<EnhancedNotificationContextType | undefined>(undefined);

export function EnhancedNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info', duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      message,
      type,
      timestamp: new Date(),
      duration,
    };

    // Add to history
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50

    // Show toast
    const toastOptions = {
      duration,
      description: message,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
      default:
        toast.info(message, toastOptions);
        break;
    }

    return id;
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <EnhancedNotificationContext.Provider
      value={{
        notifications,
        showNotification,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </EnhancedNotificationContext.Provider>
  );
}

export function useEnhancedNotification() {
  const context = useContext(EnhancedNotificationContext);
  if (!context) {
    throw new Error('useEnhancedNotification must be used within EnhancedNotificationProvider');
  }
  return context;
}
