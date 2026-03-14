/**
 * Automation Service
 * Сервис для управления правилами автоматизации
 */

import { db } from '@/core/database';
import type { AutomationRule, AutomationLog } from './types';
import { automationEngine } from './automation-engine';

/**
 * CRUD операции для правил автоматизации
 */

/**
 * Создать правило
 */
export async function createAutomationRule(
  rule: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'trigger_count' | 'error_count'>
): Promise<AutomationRule> {
  const now = Date.now();

  const newRule: AutomationRule = {
    ...rule,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    trigger_count: 0,
    error_count: 0,
  };

  await db.automation_rules.add(newRule);

  // Регистрируем правило в движке
  automationEngine.registerRule(newRule);

  return newRule;
}

/**
 * Получить правило по ID
 */
export async function getAutomationRule(ruleId: string): Promise<AutomationRule | undefined> {
  return db.automation_rules.get(ruleId);
}

/**
 * Получить все правила
 */
export async function getAllAutomationRules(): Promise<AutomationRule[]> {
  return db.automation_rules.toArray();
}

/**
 * Получить активные правила
 */
export async function getActiveAutomationRules(): Promise<AutomationRule[]> {
  return db.automation_rules.where('enabled').equals(1).toArray();
}

/**
 * Обновить правило
 */
export async function updateAutomationRule(
  ruleId: string,
  updates: Partial<AutomationRule>
): Promise<void> {
  const rule = await getAutomationRule(ruleId);

  if (!rule) {
    throw new Error(`Rule ${ruleId} not found`);
  }

  const updatedRule = {
    ...rule,
    ...updates,
    updated_at: Date.now(),
  };

  await db.automation_rules.put(updatedRule);

  // Обновляем в движке
  automationEngine.updateRule(ruleId, updates);
}

/**
 * Удалить правило
 */
export async function deleteAutomationRule(ruleId: string): Promise<void> {
  await db.automation_rules.delete(ruleId);

  // Удаляем из движка
  automationEngine.unregisterRule(ruleId);
}

/**
 * Включить/выключить правило
 */
export async function toggleAutomationRule(
  ruleId: string,
  enabled: boolean
): Promise<void> {
  await updateAutomationRule(ruleId, { enabled });
}

/**
 * Получить логи автоматизации
 */
export async function getAutomationLogs(
  limit = 50,
  ruleId?: string
): Promise<AutomationLog[]> {
  let logs = await db.automation_logs.orderBy('started_at').reverse().toArray();

  if (ruleId) {
    logs = logs.filter((log) => log.rule_id === ruleId);
  }

  return logs.slice(0, limit);
}

/**
 * Добавить лог автоматизации
 */
export async function createAutomationLog(log: AutomationLog): Promise<string> {
  await db.automation_logs.add(log);
  return log.id;
}

/**
 * Очистить логи автоматизации
 */
export async function clearAutomationLogs(ruleId?: string): Promise<void> {
  if (ruleId) {
    const logs = await db.automation_logs.where('rule_id').equals(ruleId).toArray();
    await Promise.all(logs.map((log) => db.automation_logs.delete(log.id)));
  } else {
    await db.automation_logs.clear();
  }
}

/**
 * Получить статистику по правилу
 */
export async function getRuleStatistics(ruleId: string): Promise<{
  rule: AutomationRule | undefined;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecutions: AutomationLog[];
}> {
  const rule = await getAutomationRule(ruleId);
  const logs = await db.automation_logs.where('rule_id').equals(ruleId).toArray();

  const successfulExecutions = logs.filter((log) => log.status === 'completed').length;
  const failedExecutions = logs.filter((log) => log.status === 'failed').length;

  const lastExecutions = logs
    .sort((a, b) => b.started_at - a.started_at)
    .slice(0, 10);

  return {
    rule,
    totalExecutions: logs.length,
    successfulExecutions,
    failedExecutions,
    lastExecutions,
  };
}

/**
 * Экспорт правил в JSON
 */
export async function exportAutomationRules(): Promise<string> {
  const rules = await getAllAutomationRules();
  return JSON.stringify(rules, null, 2);
}

/**
 * Импорт правил из JSON
 */
export async function importAutomationRules(
  json: string,
  merge = false
): Promise<{ imported: number; skipped: number }> {
  try {
    const rules: AutomationRule[] = JSON.parse(json);

    if (!Array.isArray(rules)) {
      throw new Error('Invalid JSON format: expected array');
    }

    let imported = 0;
    let skipped = 0;

    if (merge) {
      // Merge mode: обновляем существующие, добавляем новые
      for (const rule of rules) {
        const existing = await getAutomationRule(rule.id);

        if (existing) {
          await updateAutomationRule(rule.id, rule);
          skipped++;
        } else {
          await createAutomationRule(rule);
          imported++;
        }
      }
    } else {
      // Replace mode: очищаем все правила и добавляем новые
      await db.automation_rules.clear();
      automationEngine.getAllRules().forEach((rule) => {
        automationEngine.unregisterRule(rule.id);
      });

      for (const rule of rules) {
        await db.automation_rules.add(rule);
        automationEngine.registerRule(rule);
        imported++;
      }
    }

    return { imported, skipped };
  } catch (error) {
    throw new Error(
      `Failed to import rules: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
