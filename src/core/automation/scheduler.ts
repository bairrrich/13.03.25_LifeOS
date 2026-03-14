/**
 * Scheduler для Automation System
 * Управление расписаниями и периодическими проверками
 */

import type { AutomationRule } from './types';
import { automationEngine } from './automation-engine';

/**
 * Парсер cron-выражений (упрощенный)
 * Поддерживает: minute hour day month weekday
 */
export function parseCron(cron: string): {
  minutes: number[];
  hours: number[];
  days: number[];
  months: number[];
  weekdays: number[];
} {
  const parts = cron.trim().split(/\s+/);

  if (parts.length !== 5) {
    throw new Error('Invalid cron expression: expected 5 parts');
  }

  const [minute, hour, day, month, weekday] = parts;

  return {
    minutes: parseCronPart(minute, 0, 59),
    hours: parseCronPart(hour, 0, 23),
    days: parseCronPart(day, 1, 31),
    months: parseCronPart(month, 1, 12),
    weekdays: parseCronPart(weekday, 0, 6),
  };
}

/**
 * Парсер отдельной части cron-выражения
 */
function parseCronPart(part: string, min: number, max: number): number[] {
  // wildcard
  if (part === '*') {
    return range(min, max);
  }

  // шаг (*/5)
  if (part.startsWith('*/')) {
    const step = parseInt(part.slice(2), 10);
    if (isNaN(step) || step <= 0) {
      throw new Error(`Invalid cron step: ${part}`);
    }
    const result: number[] = [];
    for (let i = min; i <= max; i += step) {
      result.push(i);
    }
    return result;
  }

  // диапазон (1-5)
  if (part.includes('-')) {
    const [start, end] = part.split('-').map((n) => parseInt(n, 10));
    if (isNaN(start) || isNaN(end)) {
      throw new Error(`Invalid cron range: ${part}`);
    }
    return range(start, end);
  }

  // список (1,2,3)
  if (part.includes(',')) {
    return part.split(',').map((n) => {
      const num = parseInt(n, 10);
      if (isNaN(num) || num < min || num > max) {
        throw new Error(`Invalid cron value: ${n}`);
      }
      return num;
    });
  }

  // одиночное значение
  const num = parseInt(part, 10);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid cron value: ${part}`);
  }
  return [num];
}

function range(min: number, max: number): number[] {
  const result: number[] = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
}

/**
 * Проверка, соответствует ли дата cron-выражению
 */
export function matchesCron(date: Date, parsed: ReturnType<typeof parseCron>): boolean {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1; // getMonth() возвращает 0-11
  const weekdays = date.getDay(); // 0 = воскресенье

  return (
    parsed.minutes.includes(minutes) &&
    parsed.hours.includes(hours) &&
    parsed.days.includes(days) &&
    parsed.months.includes(months) &&
    parsed.weekdays.includes(weekdays)
  );
}

/**
 * Класс Scheduler для управления расписаниями
 */
export class AutomationScheduler {
  private intervals: Map<string, number> = new Map();
  private timeouts: Map<string, number> = new Map();
  private running = false;

  /**
   * Запустить scheduler
   */
  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;

    // Проверка каждую минуту для cron-расписаний
    const intervalId = window.setInterval(() => {
      this.checkSchedules();
    }, 60000);

    this.intervals.set('cron-check', intervalId);
  }

  /**
   * Остановить scheduler
   */
  stop(): void {
    this.running = false;

    // Очистка всех интервалов
    this.intervals.forEach((id) => window.clearInterval(id));
    this.intervals.clear();

    // Очистка всех таймаутов
    this.timeouts.forEach((id) => window.clearTimeout(id));
    this.timeouts.clear();
  }

  /**
   * Проверить расписания всех правил
   */
  private async checkSchedules(): Promise<void> {
    if (!this.running) return;

    const rules = automationEngine.getAllRules();
    const now = new Date();

    for (const rule of rules) {
      if (!rule.enabled || rule.trigger.type !== 'schedule' || !rule.trigger.schedule) {
        continue;
      }

      const { schedule } = rule.trigger;

      if (!schedule.enabled || !schedule.cron) {
        continue;
      }

      try {
        const parsed = parseCron(schedule.cron);

        if (matchesCron(now, parsed)) {
          await automationEngine.triggerByEvent('schedule' as never, {
            rule_id: rule.id,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error(`Error checking schedule for rule ${rule.name}:`, error);
      }
    }
  }

  /**
   * Запланировать правило на определенное время
   */
  scheduleAt(ruleId: string, date: Date): void {
    const delay = date.getTime() - Date.now();

    if (delay <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      await automationEngine.triggerManual(ruleId);
      this.timeouts.delete(ruleId);
    }, delay);

    const existingTimeout = this.timeouts.get(ruleId);
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    this.timeouts.set(ruleId, timeoutId);
  }

  /**
   * Запланировать правило с задержкой
   */
  scheduleDelay(ruleId: string, delayMs: number): void {
    this.scheduleAt(ruleId, new Date(Date.now() + delayMs));
  }

  /**
   * Отменить запланированное выполнение
   */
  cancelSchedule(ruleId: string): void {
    const timeoutId = this.timeouts.get(ruleId);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      this.timeouts.delete(ruleId);
    }
  }

  /**
   * Получить статус scheduler
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Получить количество запланированных задач
   */
  getScheduledCount(): number {
    return this.timeouts.size;
  }
}

/**
 * Condition Checker для периодической проверки условий
 */
export class ConditionChecker {
  private intervals: Map<string, number> = new Map();
  private running = false;

  /**
   * Запустить проверку условий
   */
  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;

    // Проверка каждые 5 секунд для condition-триггеров
    const intervalId = window.setInterval(() => {
      this.checkConditions();
    }, 5000);

    this.intervals.set('condition-check', intervalId);
  }

  /**
   * Остановить проверку условий
   */
  stop(): void {
    this.running = false;

    this.intervals.forEach((id) => window.clearInterval(id));
    this.intervals.clear();
  }

  /**
   * Проверить условия всех правил с condition-триггерами
   */
  private async checkConditions(): Promise<void> {
    if (!this.running) return;

    const rules = automationEngine.getAllRules();

    for (const rule of rules) {
      if (
        !rule.enabled ||
        rule.trigger.type !== 'condition' ||
        !rule.conditions ||
        rule.conditions.length === 0
      ) {
        continue;
      }

      // Здесь должна быть логика получения данных для проверки
      // Для демонстрации просто пропускаем
      console.log(`Checking condition for rule: ${rule.name}`);
    }
  }

  /**
   * Получить статус checker
   */
  isRunning(): boolean {
    return this.running;
  }
}

/**
 * Глобальные экземпляры
 */
export const scheduler = new AutomationScheduler();
export const conditionChecker = new ConditionChecker();

/**
 * Инициализация системы расписаний
 */
export function initAutomationScheduler(): void {
  scheduler.start();
  conditionChecker.start();
}

/**
 * Остановка системы расписаний
 */
export function stopAutomationScheduler(): void {
  scheduler.stop();
  conditionChecker.stop();
}
