/**
 * Интеграция Automation System с Event System
 * Автоматический запуск правил при наступлении событий
 */

import { on, type EventType } from '@/core/events';
import { automationEngine } from './automation-engine';

/**
 * Подписывает Automation Engine на все события
 */
export function initAutomationEventIntegration(): void {
  // Получаем все правила с event-триггерами
  const rules = automationEngine.getAllRules();

  // Собираем уникальные типы событий
  const eventTypes = new Set<EventType>();

  rules.forEach((rule) => {
    if (rule.enabled && rule.trigger.type === 'event' && rule.trigger.event) {
      eventTypes.add(rule.trigger.event as never);
    }
  });

  // Подписываемся на каждое событие
  eventTypes.forEach((eventType) => {
    on(eventType, async (payload) => {
      await automationEngine.triggerByEvent(eventType as never, payload);
    });
  });
}

/**
 * Динамическая подписка на событие
 */
export function subscribeToEvent(eventType: EventType): void {
  on(eventType, async (payload) => {
    await automationEngine.triggerByEvent(eventType as never, payload);
  });
}

/**
 * Переподписка на события после изменения правил
 */
export function refreshAutomationSubscriptions(): void {
  // Очищаем старые подписки (в будущем можно реализовать отписку)
  // И создаем новые
  initAutomationEventIntegration();
}
