/**
 * Типы для системы уведомлений LifeOS
 */

/**
 * Типы уведомлений
 */
export type NotificationType =
  | 'info'      // Информация
  | 'success'   // Успешное действие
  | 'warning'   // Предупреждение
  | 'error';    // Ошибка

/**
 * Приоритет уведомления
 */
export type NotificationPriority =
  | 'low'       // Низкий (не срочно)
  | 'medium'    // Средний (обычное)
  | 'high';     // Высокий (важное)

/**
 * Структура уведомления
 */
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
  read: boolean;
  autoClose?: number;  // Автозакрытие через мс
  metadata?: Record<string, unknown>;
}

/**
 * Настройки уведомлений
 */
export interface NotificationSettings {
  enabled: boolean;
  showInApp: boolean;
  sound: boolean;
  desktop: boolean;
  maxVisible: number;  // Максимум видимых toast
  autoClose: number;   // Время автозакрытия (мс)
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Фильтр для списка уведомлений
 */
export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  limit?: number;
}

/**
 * Статистика уведомлений
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

/**
 * Callback для обработки клика по действию
 */
export type NotificationActionCallback = (notification: Notification) => void;

/**
 * Конфигурация для создания уведомления
 */
export type CreateNotificationInput = Omit<
  Notification,
  'id' | 'timestamp' | 'read'
>;

/**
 * Предустановленные шаблоны уведомлений
 */
export interface NotificationTemplates {
  // Finance
  budgetExceeded: (data: { category: string; amount: number; budget: number }) => CreateNotificationInput;
  largeTransaction: (data: { amount: number; currency: string }) => CreateNotificationInput;
  
  // Habits
  habitCompleted: (data: { habitName: string; streak: number }) => CreateNotificationInput;
  habitMissed: (data: { habitName: string }) => CreateNotificationInput;
  
  // Goals
  goalCompleted: (data: { goalName: string }) => CreateNotificationInput;
  goalMilestone: (data: { goalName: string; progress: number }) => CreateNotificationInput;
  
  // Health
  reminder: (data: { title: string; message: string }) => CreateNotificationInput;
  
  // Automation
  automationError: (data: { ruleName: string; error: string }) => CreateNotificationInput;
  automationTriggered: (data: { ruleName: string }) => CreateNotificationInput;
}
