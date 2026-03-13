/**
 * Event System для LifeOS
 * Централизованная система событий для связи между модулями
 */

/**
 * Типы событий в системе
 */
export type EventType =
  // Finance events
  | 'transaction.created'
  | 'transaction.updated'
  | 'transaction.deleted'
  | 'account.created'
  | 'account.updated'
  | 'account.deleted'
  | 'budget.created'
  | 'budget.updated'
  | 'budget.deleted'
  
  // Habits events
  | 'habit.created'
  | 'habit.updated'
  | 'habit.deleted'
  | 'habit_log.created'
  | 'habit_log.updated'
  | 'habit_log.deleted'
  | 'habit.completed'
  | 'habit.streak_updated'
  
  // Nutrition events
  | 'food.created'
  | 'food.updated'
  | 'food.deleted'
  | 'meal.created'
  | 'meal.updated'
  | 'meal.deleted'
  | 'meal_entry.created'
  | 'meal_entry.updated'
  | 'meal_entry.deleted'
  
  // Workouts events
  | 'exercise.created'
  | 'exercise.updated'
  | 'exercise.deleted'
  | 'workout.created'
  | 'workout.updated'
  | 'workout.deleted'
  | 'workout.completed'
  | 'set.created'
  | 'set.updated'
  | 'set.deleted'
  
  // Health events
  | 'sleep_log.created'
  | 'sleep_log.updated'
  | 'sleep_log.deleted'
  | 'weight_log.created'
  | 'weight_log.updated'
  | 'weight_log.deleted'
  
  // Goals events
  | 'goal.created'
  | 'goal.updated'
  | 'goal.deleted'
  | 'goal.progress_updated'
  | 'goal.completed'
  
  // Mind events
  | 'book.created'
  | 'book.updated'
  | 'book.deleted'
  
  // Beauty events
  | 'cosmetic.created'
  | 'cosmetic.updated'
  | 'cosmetic.deleted'
  
  // System events
  | 'sync.started'
  | 'sync.completed'
  | 'sync.error'
  | 'user.login'
  | 'user.logout';

/**
 * Структура события
 */
export interface LifeOSEvent {
  type: EventType;
  payload: unknown;
  timestamp: number;
  source?: string;
}

/**
 * Тип обработчика событий
 */
export type EventHandler = (payload: unknown, event: LifeOSEvent) => void | Promise<void>;

/**
 * Подписка на событие
 */
interface Subscription {
  id: string;
  event: EventType;
  handler: EventHandler;
  once?: boolean;
}

/**
 * Event Bus класс
 */
class EventBus {
  private subscriptions: Map<EventType, Set<Subscription>> = new Map();
  private eventHistory: LifeOSEvent[] = [];
  private maxHistory = 100;

  /**
   * Подписаться на событие
   */
  on(event: EventType, handler: EventHandler): () => void {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }

    const subscription: Subscription = {
      id: this.generateId(),
      event,
      handler,
    };

    this.subscriptions.get(event)!.add(subscription);

    // Возвращаем функцию отписки
    return () => this.off(event, subscription.id);
  }

  /**
   * Подписаться один раз
   */
  once(event: EventType, handler: EventHandler): () => void {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }

    const subscription: Subscription = {
      id: this.generateId(),
      event,
      handler,
      once: true,
    };

    this.subscriptions.get(event)!.add(subscription);

    return () => this.off(event, subscription.id);
  }

  /**
   * Отписаться от события
   */
  off(event: EventType, subscriptionId: string): void {
    const subs = this.subscriptions.get(event);
    if (subs) {
      subs.forEach((sub) => {
        if (sub.id === subscriptionId) {
          subs.delete(sub);
        }
      });
    }
  }

  /**
   * Отписаться от всех событий
   */
  offAll(): void {
    this.subscriptions.clear();
  }

  /**
   * Опубликовать событие
   */
  async emit(event: EventType, payload: unknown, source?: string): Promise<void> {
    const lifeOsEvent: LifeOSEvent = {
      type: event,
      payload,
      timestamp: Date.now(),
      source,
    };

    // Сохраняем в историю
    this.addToHistory(lifeOsEvent);

    // Получаем подписчиков
    const subs = this.subscriptions.get(event);
    if (!subs || subs.size === 0) {
      return;
    }

    // Выполняем обработчики
    const promises: Promise<void>[] = [];
    
    subs.forEach((sub) => {
      try {
        const result = sub.handler(payload, lifeOsEvent);
        if (result instanceof Promise) {
          promises.push(result.then(() => {
            if (sub.once) {
              subs.delete(sub);
            }
          }));
        } else {
          if (sub.once) {
            subs.delete(sub);
          }
        }
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Получить историю событий
   */
  getHistory(limit = 50): LifeOSEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Очистить историю
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Получить количество подписчиков на событие
   */
  getSubscriberCount(event: EventType): number {
    return this.subscriptions.get(event)?.size || 0;
  }

  /**
   * Получить все типы событий с подписчиками
   */
  getActiveEvents(): EventType[] {
    return Array.from(this.subscriptions.keys()).filter(
      (event) => this.subscriptions.get(event)!.size > 0
    );
  }

  private addToHistory(event: LifeOSEvent): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Глобальный экземпляр Event Bus
 */
export const eventBus = new EventBus();

/**
 * Утилита для публикации события
 */
export function emit(event: EventType, payload: unknown, source?: string): void {
  eventBus.emit(event, payload, source).catch(console.error);
}

/**
 * Утилита для подписки на событие
 */
export function on(event: EventType, handler: EventHandler): () => void {
  return eventBus.on(event, handler);
}

/**
 * Утилита для одноразовой подписки
 */
export function once(event: EventType, handler: EventHandler): () => void {
  return eventBus.once(event, handler);
}

/**
 * Утилита для отписки
 */
export function off(event: EventType, subscriptionId: string): void {
  eventBus.off(event, subscriptionId);
}
