/**
 * Notification Service
 * Сервис для управления уведомлениями в приложении
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

// Глобальный callback для уведомлений
let notificationCallback: ((data: NotificationData) => void) | null = null;

/**
 * Установить callback для уведомлений
 */
export function setNotificationCallback(callback: (data: NotificationData) => void) {
  notificationCallback = callback;
}

/**
 * Отправить уведомление
 */
function notify(data: NotificationData) {
  if (notificationCallback) {
    notificationCallback(data);
  }
}

/**
 * Показать success уведомление
 */
export function notifySuccess(title: string, message?: string, duration?: number) {
  notify({ type: 'success', title, message, duration });
}

/**
 * Показать error уведомление
 */
export function notifyError(title: string, message?: string, duration?: number) {
  notify({ type: 'error', title, message, duration });
}

/**
 * Показать warning уведомление
 */
export function notifyWarning(title: string, message?: string, duration?: number) {
  notify({ type: 'warning', title, message, duration });
}

/**
 * Показать info уведомление
 */
export function notifyInfo(title: string, message?: string, duration?: number) {
  notify({ type: 'info', title, message, duration });
}

/**
 * Уведомления для финансов
 */
export const financeNotifications = {
  budgetExceeded: (category: string, amount: number) =>
    notifyWarning(
      'Бюджет превышен',
      `Превышен бюджет категории "${category}" на ${amount}€`
    ),
  
  transactionAdded: (amount: number, type: string) =>
    notifySuccess(
      'Транзакция добавлена',
      `${type === 'income' ? '+' : '-'}${amount}€`
    ),
  
  lowBalance: (account: string, balance: number) =>
    notifyWarning(
      'Низкий баланс',
      `На счёте "${account}" осталось ${balance}€`
    ),
};

/**
 * Уведомления для привычек
 */
export const habitsNotifications = {
  habitCompleted: (name: string) =>
    notifySuccess('Привычка выполнена', `${name} - отлично!`),
  
  habitMissed: (name: string) =>
    notifyWarning('Привычка пропущена', `${name} не выполнена сегодня`),
  
  streakReached: (name: string, streak: number) =>
    notifySuccess('Серия!', `${name}: ${streak} дней подряд`),
  
  reminder: (name: string) =>
    notifyInfo('Напоминание', `Пора выполнить: ${name}`),
};

/**
 * Уведомления для здоровья
 */
export const healthNotifications = {
  goalReached: (goal: string, value: number) =>
    notifySuccess('Цель достигнута', `${goal}: ${value}`),
  
  reminder: (type: string) =>
    notifyInfo('Напоминание', `Пора ${type}`),
};

/**
 * Уведомления для тренировок
 */
export const workoutsNotifications = {
  workoutCompleted: (name: string) =>
    notifySuccess('Тренировка завершена', name),
  
  personalRecord: (exercise: string, value: number) =>
    notifySuccess('Личный рекорд!', `${exercise}: ${value}`),
};
