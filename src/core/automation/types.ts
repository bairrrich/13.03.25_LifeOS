/**
 * Типы для системы автоматизации LifeOS
 */

import type { EventType } from '@/core/events';
import type { TableName } from '@/core/database';

/**
 * Типы триггеров
 */
export type TriggerType =
  | 'event'           // Срабатывание по событию
  | 'schedule'        // Срабатывание по расписанию
  | 'condition'       // Срабатывание по условию (периодическая проверка)
  | 'manual';         // Ручной запуск

/**
 * Типы условий
 */
export type ConditionType =
  | 'equals'          // Равно
  | 'not_equals'      // Не равно
  | 'greater_than'    // Больше
  | 'less_than'       // Меньше
  | 'contains'        // Содержит
  | 'not_contains'    // Не содержит
  | 'starts_with'     // Начинается с
  | 'ends_with'       // Заканчивается на
  | 'exists'          // Существует
  | 'not_exists'      // Не существует
  | 'regex'           // Соответствует regex
  | 'between'         // Между
  | 'in'              // В списке
  | 'and'             // Логическое И
  | 'or'              // Логическое ИЛИ
  | 'not';            // Логическое НЕ

/**
 * Типы действий
 */
export type ActionType =
  | 'create_entity'   // Создать сущность
  | 'update_entity'   // Обновить сущность
  | 'delete_entity'   // Удалить сущность
  | 'send_notification'  // Отправить уведомление
  | 'run_script'      // Выполнить скрипт
  | 'webhook'         // Вызвать webhook
  | 'copy_data'       // Копировать данные
  | 'aggregate_data'  // Агрегировать данные
  | 'tag_entity'      // Добавить тег
  | 'change_status';  // Изменить статус

/**
 * Расписание для cron-триггеров
 */
export interface ScheduleConfig {
  cron: string;              // Cron-выражение
  timezone?: string;         // Временная зона
  enabled: boolean;          // Включено ли расписание
}

/**
 * Конфигурация триггера
 */
export interface TriggerConfig {
  type: TriggerType;
  event?: EventType;                    // Для event-триггеров
  schedule?: ScheduleConfig;            // Для schedule-триггеров
  condition_check_interval?: number;    // Интервал проверки условия (мс)
}

/**
 * Базовое условие
 */
export interface BaseCondition {
  type: ConditionType;
  field?: string;                       // Поле для проверки
  value?: unknown;                      // Значение для сравнения
  values?: unknown[];                   // Для 'in' и 'between'
  pattern?: string;                     // Для regex
}

/**
 * Логическое условие (and/or/not)
 */
export interface LogicalCondition {
  type: 'and' | 'or' | 'not';
  conditions: Condition[];
}

/**
 * Условие может быть простым или логическим
 */
export type Condition = BaseCondition | LogicalCondition;

/**
 * Конфигурация действия
 */
export interface ActionConfig {
  type: ActionType;
  entity_type?: TableName;              // Для действий с сущностями
  data?: Record<string, unknown>;       // Данные для создания/обновления
  entity_id?: string;                   // ID сущности для update/delete
  template?: string;                    // Шаблон для notification
  script?: string;                      // Код скрипта
  webhook_url?: string;                 // URL webhook
  webhook_method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  webhook_headers?: Record<string, string>;
  field_mappings?: Record<string, string>;  // Маппинг полей для copy_data
  aggregation?: {
    source_entity: TableName;
    field: string;
    operation: 'sum' | 'avg' | 'count' | 'min' | 'max';
    filter?: Condition;
  };
  tag?: string;                         // Тег для tag_entity
  status?: string;                      // Статус для change_status
}

/**
 * Правило автоматизации
 */
export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: TriggerConfig;
  conditions?: Condition[];             // Условия для выполнения действий
  actions: ActionConfig[];
  priority: number;                     // Приоритет выполнения (0-100)
  run_once?: boolean;                   // Выполнить только один раз
  cooldown_ms?: number;                 // Задержка между выполнениями
  created_at: number;
  updated_at: number;
  last_triggered_at?: number;
  trigger_count: number;                // Количество срабатываний
  error_count: number;                  // Количество ошибок
}

/**
 * Контекст выполнения правила
 */
export interface RuleContext {
  rule_id: string;
  triggered_by: EventType | 'schedule' | 'manual';
  payload?: unknown;
  timestamp: number;
}

/**
 * Лог выполнения правила
 */
export interface AutomationLog {
  id: string;
  rule_id: string;
  rule_name: string;
  triggered_by: EventType | 'schedule' | 'manual';
  payload?: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at: number;
  completed_at?: number;
  error?: string;
  actions_executed: number;
  actions_failed: number;
  result?: unknown;
}

/**
 * Результат выполнения действия
 */
export interface ActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Результат проверки условия
 */
export interface ConditionResult {
  matches: boolean;
  reason?: string;
}

/**
 * Конфигурация шаблона для уведомлений
 */
export interface NotificationTemplate {
  title: string;
  body: string;
  icon?: string;
  action_url?: string;
}

/**
 * Переменные для шаблонов
 */
export interface TemplateVariables {
  [key: string]: unknown;
}

/**
 * Типы операторов для маппинга данных
 */
export type OperatorFunction = (value: unknown, context: RuleContext) => unknown;

/**
 * Предустановленные операторы
 */
export type BuiltInOperator =
  | 'identity'          // Возвращает значение как есть
  | 'current_timestamp' // Текущая временная метка
  | 'current_date'      // Текущая дата
  | 'sum'               // Сумма
  | 'average'           // Среднее
  | 'count'             // Количество
  | 'concat'            // Конкатенация
  | 'extract_field';    // Извлечение поля из объекта
