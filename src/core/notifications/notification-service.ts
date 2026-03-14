/**
 * Notification Service для LifeOS
 * Управление очередью уведомлений, отправкой и очисткой
 */

import type {
  Notification,
  NotificationSettings,
  NotificationFilter,
  NotificationStats,
  CreateNotificationInput,
  NotificationType,
} from './types';

/**
 * Настройки по умолчанию
 */
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  showInApp: true,
  sound: false,
  desktop: false,
  maxVisible: 5,
  autoClose: 5000,
  position: 'top-right',
};

/**
 * Генерация уникального ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Класс Notification Service
 */
export class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private settings: NotificationSettings = { ...DEFAULT_SETTINGS };
  private listeners: Set<() => void> = new Set();
  private actionCallbacks: Map<string, () => void> = new Map();
  private storageKey = 'lifeos-notifications';
  private settingsKey = 'lifeos-notification-settings';

  constructor() {
    this.loadFromStorage();
    this.loadSettings();
  }

  /**
   * Подписаться на изменения
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Уведомить подписчиков
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener());
    this.saveToStorage();
  }

  /**
   * Создать уведомление
   */
  create(input: CreateNotificationInput): string {
    if (!this.settings.enabled) {
      return '';
    }

    const notification: Notification = {
      ...input,
      id: generateId(),
      timestamp: Date.now(),
      read: false,
    };

    this.notifications.set(notification.id, notification);

    // Сохраняем callback действия
    if (input.action?.onClick) {
      this.actionCallbacks.set(notification.id, input.action.onClick);
    }

    // Показываем toast
    if (this.settings.showInApp) {
      this.showToast(notification);
    }

    // Отправляем desktop уведомление
    if (this.settings.desktop && 'Notification' in window) {
      this.showDesktopNotification(notification);
    }

    // Воспроизводим звук
    if (this.settings.sound) {
      this.playSound();
    }

    this.notify();

    // Планируем автозакрытие
    if (notification.autoClose) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.autoClose);
    }

    return notification.id;
  }

  /**
   * Получить уведомление по ID
   */
  get(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  /**
   * Получить все уведомления
   */
  getAll(filter?: NotificationFilter): Notification[] {
    let notifications = Array.from(this.notifications.values());

    if (filter) {
      if (filter.type !== undefined) {
        notifications = notifications.filter((n) => n.type === filter.type);
      }
      if (filter.priority !== undefined) {
        notifications = notifications.filter((n) => n.priority === filter.priority);
      }
      if (filter.read !== undefined) {
        notifications = notifications.filter((n) => n.read === filter.read);
      }
      if (filter.limit !== undefined) {
        notifications = notifications.slice(0, filter.limit);
      }
    }

    // Сортировка: новые сначала
    notifications.sort((a, b) => b.timestamp - a.timestamp);

    return notifications;
  }

  /**
   * Получить непрочитанные уведомления
   */
  getUnread(): Notification[] {
    return this.getAll({ read: false });
  }

  /**
   * Отметить как прочитанное
   */
  markAsRead(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  /**
   * Отметить все как прочитанные
   */
  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.read = true;
    });
    this.notify();
  }

  /**
   * Удалить уведомление
   */
  dismiss(id: string): void {
    this.notifications.delete(id);
    this.actionCallbacks.delete(id);
    this.notify();
  }

  /**
   * Удалить все уведомления
   */
  dismissAll(): void {
    this.notifications.clear();
    this.actionCallbacks.clear();
    this.notify();
  }

  /**
   * Удалить прочитанные уведомления
   */
  dismissRead(): void {
    this.notifications.forEach((notification, id) => {
      if (notification.read) {
        this.dismiss(id);
      }
    });
  }

  /**
   * Выполнить действие уведомления
   */
  executeAction(id: string): void {
    const callback = this.actionCallbacks.get(id);
    if (callback) {
      callback();
      this.dismiss(id);
    }
  }

  /**
   * Получить статистику
   */
  getStats(): NotificationStats {
    const notifications = this.getAll();

    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      byType: {
        info: 0,
        success: 0,
        warning: 0,
        error: 0,
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
      },
    };

    notifications.forEach((n) => {
      stats.byType[n.type]++;
      stats.byPriority[n.priority]++;
    });

    return stats;
  }

  /**
   * Обновить настройки
   */
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
    this.notify();
  }

  /**
   * Получить настройки
   */
  getSettings(): NotificationSettings {
    return this.settings;
  }

  /**
   * Сбросить настройки
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.notify();
  }

  /**
   * Запросить разрешение на desktop уведомления
   */
  async requestDesktopPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Сохранить в localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = Array.from(this.notifications.values());
      // Храним только последние 100 уведомлений
      const recent = data.slice(-100);
      localStorage.setItem(this.storageKey, JSON.stringify(recent));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  /**
   * Загрузить из localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const notifications: Notification[] = JSON.parse(data);
        notifications.forEach((n) => this.notifications.set(n.id, n));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  /**
   * Сохранить настройки
   */
  private saveSettings(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Загрузить настройки
   */
  private loadSettings(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.settingsKey);
      if (data) {
        this.settings = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  /**
   * Показать toast уведомление
   */
  private showToast(notification: Notification): void {
    // Событие для Toast компонента
    const event = new CustomEvent('lifeos-toast', { detail: notification });
    window.dispatchEvent(event);
  }

  /**
   * Показать desktop уведомление
   */
  private showDesktopNotification(notification: Notification): void {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const icon = this.getIconForType(notification.type);

    new Notification(notification.title, {
      body: notification.message,
      icon,
      tag: notification.id,
      requireInteraction: notification.priority === 'high',
    });
  }

  /**
   * Воспроизвести звук
   */
  private playSound(): void {
    // Простой beep через Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  /**
   * Получить иконку для типа
   */
  private getIconForType(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    return icons[type];
  }

  /**
   * Предустановленные шаблоны уведомлений
   */
  templates = {
    // Finance
    budgetExceeded: (data: { category: string; amount: number; budget: number }) =>
      this.create({
        type: 'warning',
        priority: 'high',
        title: 'Превышение бюджета',
        message: `Бюджет категории "${data.category}" превышен: ${data.amount}€ из ${data.budget}€`,
        autoClose: 10000,
      }),

    largeTransaction: (data: { amount: number; currency: string }) =>
      this.create({
        type: 'info',
        priority: 'medium',
        title: 'Крупная транзакция',
        message: `Зафиксирована транзакция на сумму ${data.amount} ${data.currency}`,
        autoClose: 5000,
      }),

    // Habits
    habitCompleted: (data: { habitName: string; streak: number }) =>
      this.create({
        type: 'success',
        priority: 'low',
        title: 'Привычка выполнена! 🎉',
        message: `"${data.habitName}" выполнена. Серия: ${data.streak} дн.`,
        autoClose: 3000,
      }),

    habitMissed: (data: { habitName: string }) =>
      this.create({
        type: 'warning',
        priority: 'medium',
        title: 'Привычка пропущена',
        message: `"${data.habitName}" не выполнена сегодня`,
        autoClose: 5000,
      }),

    // Goals
    goalCompleted: (data: { goalName: string }) =>
      this.create({
        type: 'success',
        priority: 'high',
        title: 'Цель достигнута! 🏆',
        message: `Поздравляем! Цель "${data.goalName}" выполнена!`,
        autoClose: 10000,
      }),

    goalMilestone: (data: { goalName: string; progress: number }) =>
      this.create({
        type: 'success',
        priority: 'medium',
        title: 'Новый этап!',
        message: `Прогресс цели "${data.goalName}": ${data.progress}%`,
        autoClose: 5000,
      }),

    // Health
    reminder: (data: { title: string; message: string }) =>
      this.create({
        type: 'info',
        priority: 'medium',
        title: data.title,
        message: data.message,
        autoClose: 10000,
      }),

    // Automation
    automationError: (data: { ruleName: string; error: string }) =>
      this.create({
        type: 'error',
        priority: 'high',
        title: 'Ошибка автоматизации',
        message: `Правило "${data.ruleName}" завершилось ошибкой: ${data.error}`,
        autoClose: 15000,
      }),

    automationTriggered: (data: { ruleName: string }) =>
      this.create({
        type: 'info',
        priority: 'low',
        title: 'Правило сработало',
        message: `Правило "${data.ruleName}" выполнено`,
        autoClose: 3000,
      }),
  };
}

/**
 * Глобальный экземпляр Notification Service
 */
export const notificationService = new NotificationService();

/**
 * Утилита для создания уведомлений
 */
export function notify(input: CreateNotificationInput): string {
  return notificationService.create(input);
}

/**
 * Утилиты для быстрого создания уведомлений по типам
 */
export const notifyTypes = {
  info: (title: string, message: string) =>
    notify({ type: 'info', priority: 'medium', title, message }),

  success: (title: string, message: string) =>
    notify({ type: 'success', priority: 'medium', title, message }),

  warning: (title: string, message: string) =>
    notify({ type: 'warning', priority: 'medium', title, message }),

  error: (title: string, message: string) =>
    notify({ type: 'error', priority: 'high', title, message }),
};
