/**
 * Event System для LifeOS
 * Централизованная система событий для связи между модулями
 */

export {
  eventBus,
  emit,
  on,
  once,
  off,
  type EventType,
  type LifeOSEvent,
  type EventHandler,
} from './event-bus';
