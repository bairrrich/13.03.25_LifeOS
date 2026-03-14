/**
 * Notifications System для LifeOS
 * Система уведомлений и toast сообщений
 */

// Types
export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationSettings,
  NotificationFilter,
  NotificationStats,
  CreateNotificationInput,
  NotificationActionCallback,
  NotificationTemplates,
} from './types';

// Service
export {
  notificationService,
  notify,
  notifyTypes,
  NotificationService,
} from './notification-service';
