/**
 * Automation Engine для LifeOS
 * Основной движок для выполнения правил автоматизации
 */

import type {
  AutomationRule,
  AutomationLog,
  Condition,
  ConditionResult,
  ActionConfig,
  ActionResult,
  RuleContext,
  LogicalCondition,
  BaseCondition,
} from './types';
import { emit } from '@/core/events';

/**
 * Генерация уникального ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Класс Automation Engine
 */
export class AutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();
  private logs: Map<string, AutomationLog> = new Map();
  private ruleCooldowns: Map<string, number> = new Map();
  private triggeredRules: Set<string> = new Set();
  private maxLogs = 1000;

  /**
   * Зарегистрировать правило
   */
  registerRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Удалить правило
   */
  unregisterRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Получить правило по ID
   */
  getRule(ruleId: string): AutomationRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Получить все правила
   */
  getAllRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Обновить правило
   */
  updateRule(ruleId: string, updates: Partial<AutomationRule>): void {
    const rule = this.rules.get(ruleId);
    if (rule) {
      const updatedRule = {
        ...rule,
        ...updates,
        updated_at: Date.now(),
      };
      this.rules.set(ruleId, updatedRule);
    }
  }

  /**
   * Включить/выключить правило
   */
  toggleRule(ruleId: string, enabled: boolean): void {
    this.updateRule(ruleId, { enabled });
  }

  /**
   * Проверить условие
   */
  checkCondition(condition: Condition, data: Record<string, unknown>): ConditionResult {
    // Логические условия (type guard)
    if (this.isLogicalCondition(condition)) {
      if (condition.type === 'and') {
        const results = condition.conditions.map((c) => this.checkCondition(c, data));
        const allMatch = results.every((r) => r.matches);
        return {
          matches: allMatch,
          reason: allMatch ? undefined : 'One or more AND conditions failed',
        };
      }

      if (condition.type === 'or') {
        const results = condition.conditions.map((c) => this.checkCondition(c, data));
        const anyMatch = results.some((r) => r.matches);
        return {
          matches: anyMatch,
          reason: anyMatch ? undefined : 'All OR conditions failed',
        };
      }

      if (condition.type === 'not') {
        const result = this.checkCondition(condition.conditions[0], data);
        return {
          matches: !result.matches,
        };
      }
    }

    // Простые условия - вызываем напрямую с правильным типом
    return this.checkSimpleCondition(condition, data);
  }

  /**
   * Type guard для логических условий
   */
  private isLogicalCondition(condition: Condition): condition is LogicalCondition {
    return condition.type === 'and' || condition.type === 'or' || condition.type === 'not';
  }

  /**
   * Проверить простое условие
   */
  private checkSimpleCondition(
    condition: Exclude<Condition, LogicalCondition>,
    data: Record<string, unknown>
  ): ConditionResult {
    const { type, field, value, values, pattern } = condition;

    // Получаем значение из данных
    const actualValue = field ? this.getFieldValue(data, field) : data;

    // Проверка существования
    if (type === 'exists') {
      return { matches: actualValue !== undefined && actualValue !== null };
    }

    if (type === 'not_exists') {
      return { matches: actualValue === undefined || actualValue === null };
    }

    // Если значение отсутствует, условие не выполнено
    if (actualValue === undefined || actualValue === null) {
      return { matches: false, reason: 'Field value is null or undefined' };
    }

    // Операции сравнения
    switch (type) {
      case 'equals':
        return { matches: actualValue === value };

      case 'not_equals':
        return { matches: actualValue !== value };

      case 'greater_than':
        return {
          matches:
            typeof actualValue === 'number' &&
            typeof value === 'number' &&
            actualValue > value,
        };

      case 'less_than':
        return {
          matches:
            typeof actualValue === 'number' &&
            typeof value === 'number' &&
            actualValue < value,
        };

      case 'contains':
        return {
          matches:
            typeof actualValue === 'string' &&
            typeof value === 'string' &&
            actualValue.includes(value),
        };

      case 'not_contains':
        return {
          matches:
            typeof actualValue === 'string' &&
            typeof value === 'string' &&
            !actualValue.includes(value),
        };

      case 'starts_with':
        return {
          matches:
            typeof actualValue === 'string' &&
            typeof value === 'string' &&
            actualValue.startsWith(value),
        };

      case 'ends_with':
        return {
          matches:
            typeof actualValue === 'string' &&
            typeof value === 'string' &&
            actualValue.endsWith(value),
        };

      case 'regex':
        if (typeof actualValue !== 'string' || !pattern) {
          return { matches: false, reason: 'Invalid value or pattern for regex' };
        }
        try {
          const regex = new RegExp(pattern);
          return { matches: regex.test(actualValue) };
        } catch {
          return { matches: false, reason: 'Invalid regex pattern' };
        }

      case 'between':
        if (typeof actualValue !== 'number' || !values || values.length !== 2) {
          return { matches: false, reason: 'Invalid value for between condition' };
        }
        return {
          matches: actualValue >= Number(values[0]) && actualValue <= Number(values[1]),
        };

      case 'in':
        return {
          matches: Array.isArray(values) && values.includes(actualValue),
        };

      default:
        return { matches: false, reason: `Unknown condition type: ${type}` };
    }
  }

  /**
   * Получить значение поля из объекта (поддержка вложенных полей)
   */
  private getFieldValue(obj: Record<string, unknown>, field: string): unknown {
    const parts = field.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }

  /**
   * Проверить все условия правила
   */
  checkConditions(
    conditions: Condition[] | undefined,
    data: Record<string, unknown>
  ): ConditionResult {
    if (!conditions || conditions.length === 0) {
      return { matches: true };
    }

    // Все условия должны выполниться (AND по умолчанию)
    for (const condition of conditions) {
      const result = this.checkCondition(condition, data);
      if (!result.matches) {
        return result;
      }
    }

    return { matches: true };
  }

  /**
   * Выполнить действие
   */
  async executeAction(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    try {
      switch (action.type) {
        case 'create_entity':
          return this.executeCreateEntity(action, context);

        case 'update_entity':
          return this.executeUpdateEntity(action, context);

        case 'delete_entity':
          return this.executeDeleteEntity(action, context);

        case 'send_notification':
          return this.executeSendNotification(action, context);

        case 'run_script':
          return this.executeRunScript(action, context);

        case 'webhook':
          return this.executeWebhook(action, context);

        case 'copy_data':
          return this.executeCopyData(action, context);

        case 'aggregate_data':
          return this.executeAggregateData(action, context);

        case 'tag_entity':
          return this.executeTagEntity(action, context);

        case 'change_status':
          return this.executeChangeStatus(action, context);

        default:
          return {
            success: false,
            error: `Unknown action type: ${(action as ActionConfig).type}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Выполнить действие create_entity
   */
  private async executeCreateEntity(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    // Здесь будет интеграция с CRUD
    const { entity_type, data } = action;

    if (!entity_type || !data) {
      return { success: false, error: 'entity_type and data are required' };
    }

    // Эмитим событие создания сущности
    const eventData = {
      ...this.interpolateData(data, context),
      created_at: Date.now(),
    };

    emit(`${entity_type}.created` as never, eventData);

    return { success: true, data: eventData };
  }

  /**
   * Выполнить действие update_entity
   */
  private async executeUpdateEntity(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { entity_type, entity_id, data } = action;

    if (!entity_type || !entity_id || !data) {
      return { success: false, error: 'entity_type, entity_id and data are required' };
    }

    const eventData = {
      id: entity_id,
      ...this.interpolateData(data, context),
      updated_at: Date.now(),
    };

    emit(`${entity_type}.updated` as never, eventData);

    return { success: true, data: eventData };
  }

  /**
   * Выполнить действие delete_entity
   */
  private async executeDeleteEntity(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { entity_type, entity_id } = action;

    if (!entity_type || !entity_id) {
      return { success: false, error: 'entity_type and entity_id are required' };
    }

    emit(`${entity_type}.deleted` as never, { id: entity_id });

    return { success: true, data: { id: entity_id } };
  }

  /**
   * Выполнить действие send_notification
   */
  private async executeSendNotification(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { data } = action;

    if (!data?.title || !data?.body) {
      return { success: false, error: 'Notification title and body are required' };
    }

    const notification = {
      title: this.interpolateString(data.title as string, context),
      body: this.interpolateString(data.body as string, context),
      icon: data.icon as string | undefined,
      action_url: data.action_url as string | undefined,
    };

    emit('notification.created' as never, notification);

    return { success: true, data: notification };
  }

  /**
   * Выполнить действие run_script
   */
  private async executeRunScript(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { script } = action;

    if (!script) {
      return { success: false, error: 'Script is required' };
    }

    try {
      // Безопасное выполнение скрипта через Function constructor
      // В production лучше использовать sandboxed environment
      const fn = new Function('context', 'payload', script);
      const result = await fn(context, context.payload);

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: `Script execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Выполнить действие webhook
   */
  private async executeWebhook(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { webhook_url, webhook_method = 'POST', webhook_headers = {} } = action;

    if (!webhook_url) {
      return { success: false, error: 'Webhook URL is required' };
    }

    try {
      const response = await fetch(webhook_url, {
        method: webhook_method,
        headers: {
          'Content-Type': 'application/json',
          ...webhook_headers,
        },
        body: JSON.stringify(this.interpolateData({ payload: context.payload }, context)),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Выполнить действие copy_data
   */
  private async executeCopyData(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { field_mappings } = action;

    if (!field_mappings || !context.payload) {
      return { success: false, error: 'field_mappings and payload are required' };
    }

    const payload = context.payload as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [targetField, sourceField] of Object.entries(field_mappings)) {
      result[targetField] = this.getFieldValue(payload, sourceField);
    }

    return { success: true, data: result };
  }

  /**
   * Выполнить действие aggregate_data
   */
  private async executeAggregateData(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { aggregation } = action;

    if (!aggregation) {
      return { success: false, error: 'Aggregation config is required' };
    }

    // Здесь будет интеграция с Query Engine для агрегации данных
    // Пока возвращаем заглушку
    return {
      success: true,
      data: {
        source_entity: aggregation.source_entity,
        operation: aggregation.operation,
        result: 0, // Placeholder
      },
    };
  }

  /**
   * Выполнить действие tag_entity
   */
  private async executeTagEntity(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { entity_type, entity_id, tag } = action;

    if (!entity_type || !entity_id || !tag) {
      return { success: false, error: 'entity_type, entity_id and tag are required' };
    }

    emit(`${entity_type}.tagged` as never, { id: entity_id, tag });

    return { success: true, data: { id: entity_id, tag } };
  }

  /**
   * Выполнить действие change_status
   */
  private async executeChangeStatus(
    action: ActionConfig,
    context: RuleContext
  ): Promise<ActionResult> {
    const { entity_type, entity_id, status } = action;

    if (!entity_type || !entity_id || !status) {
      return { success: false, error: 'entity_type, entity_id and status are required' };
    }

    emit(`${entity_type}.status_changed` as never, { id: entity_id, status });

    return { success: true, data: { id: entity_id, status } };
  }

  /**
   * Интерполяция данных с переменными контекста
   */
  private interpolateData(
    data: Record<string, unknown>,
    context: RuleContext
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        result[key] = this.interpolateString(value, context);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Интерполяция строки с переменными
   */
  private interpolateString(str: string, context: RuleContext): string {
    return str.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
      if (path === 'payload') {
        return JSON.stringify(context.payload ?? '');
      }

      const value = this.getFieldValue(
        { payload: context.payload, timestamp: context.timestamp } as Record<string, unknown>,
        path
      );

      return value !== undefined ? String(value) : '';
    });
  }

  /**
   * Запустить правило
   */
  async runRule(rule: AutomationRule, context: RuleContext): Promise<AutomationLog> {
    const log: AutomationLog = {
      id: generateId(),
      rule_id: rule.id,
      rule_name: rule.name,
      triggered_by: context.triggered_by,
      payload: context.payload,
      status: 'running',
      started_at: Date.now(),
      actions_executed: 0,
      actions_failed: 0,
    };

    // Проверка cooldown
    if (rule.cooldown_ms) {
      const lastTriggered = this.ruleCooldowns.get(rule.id);
      if (lastTriggered && Date.now() - lastTriggered < rule.cooldown_ms) {
        log.status = 'skipped';
        log.completed_at = Date.now();
        log.result = { reason: 'Cooldown active' };
        this.addLog(log);
        return log;
      }
    }

    // Проверка run_once
    if (rule.run_once && this.triggeredRules.has(rule.id)) {
      log.status = 'skipped';
      log.completed_at = Date.now();
      log.result = { reason: 'Already triggered once' };
      this.addLog(log);
      return log;
    }

    try {
      // Проверка условий
      const conditionsResult = this.checkConditions(rule.conditions, context.payload as Record<string, unknown>);

      if (!conditionsResult.matches) {
        log.status = 'skipped';
        log.completed_at = Date.now();
        log.result = { reason: conditionsResult.reason };
        this.addLog(log);
        return log;
      }

      // Выполнение действий
      for (const action of rule.actions) {
        const result = await this.executeAction(action, context);

        if (result.success) {
          log.actions_executed++;
        } else {
          log.actions_failed++;
        }
      }

      // Обновление статистики правила
      this.updateRule(rule.id, {
        last_triggered_at: Date.now(),
        trigger_count: rule.trigger_count + 1,
      });

      // Установка cooldown
      if (rule.cooldown_ms) {
        this.ruleCooldowns.set(rule.id, Date.now());
      }

      // Пометка как triggered
      if (rule.run_once) {
        this.triggeredRules.add(rule.id);
      }

      log.status = 'completed';
      log.completed_at = Date.now();
      log.result = {
        actions_executed: log.actions_executed,
        actions_failed: log.actions_failed,
      };
    } catch (error) {
      log.status = 'failed';
      log.completed_at = Date.now();
      log.error = error instanceof Error ? error.message : 'Unknown error';
      log.actions_failed = rule.actions.length - log.actions_executed;

      // Обновление счетчика ошибок
      this.updateRule(rule.id, {
        error_count: rule.error_count + 1,
      });
    }

    this.addLog(log);
    return log;
  }

  /**
   * Триггер правила по событию
   */
  async triggerByEvent(eventType: string, payload: unknown): Promise<AutomationLog[]> {
    const rules = this.getAllRules().filter(
      (rule) =>
        rule.enabled &&
        rule.trigger.type === 'event' &&
        rule.trigger.event === eventType
    );

    // Сортировка по приоритету
    rules.sort((a, b) => b.priority - a.priority);

    const logs: AutomationLog[] = [];

    for (const rule of rules) {
      const context: RuleContext = {
        rule_id: rule.id,
        triggered_by: eventType as never,
        payload,
        timestamp: Date.now(),
      };

      const log = await this.runRule(rule, context);
      logs.push(log);
    }

    return logs;
  }

  /**
   * Триггер правила вручную
   */
  async triggerManual(ruleId: string, payload?: unknown): Promise<AutomationLog | null> {
    const rule = this.getRule(ruleId);

    if (!rule || !rule.enabled || rule.trigger.type !== 'manual') {
      return null;
    }

    const context: RuleContext = {
      rule_id: rule.id,
      triggered_by: 'manual',
      payload,
      timestamp: Date.now(),
    };

    return this.runRule(rule, context);
  }

  /**
   * Получить логи
   */
  getLogs(limit = 50, ruleId?: string): AutomationLog[] {
    let logs = Array.from(this.logs.values());

    if (ruleId) {
      logs = logs.filter((log) => log.rule_id === ruleId);
    }

    // Сортировка по времени (новые сначала)
    logs.sort((a, b) => b.started_at - a.started_at);

    return logs.slice(0, limit);
  }

  /**
   * Очистить логи
   */
  clearLogs(): void {
    this.logs.clear();
  }

  /**
   * Сбросить cooldown для правила
   */
  resetCooldown(ruleId: string): void {
    this.ruleCooldowns.delete(ruleId);
  }

  /**
   * Сбросить счетчик triggered правил
   */
  resetTriggeredRules(): void {
    this.triggeredRules.clear();
  }

  /**
   * Добавить лог
   */
  private addLog(log: AutomationLog): void {
    this.logs.set(log.id, log);

    // Ограничение размера логов
    if (this.logs.size > this.maxLogs) {
      const oldestLogId = Array.from(this.logs.keys())[0];
      this.logs.delete(oldestLogId);
    }
  }
}

/**
 * Глобальный экземпляр Automation Engine
 */
export const automationEngine = new AutomationEngine();
