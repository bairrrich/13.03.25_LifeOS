/**
 * Тесты для Automation Engine
 */

import { AutomationEngine } from '@/core/automation/automation-engine';
import type { AutomationRule, Condition, ActionConfig } from '@/core/automation/types';

describe('AutomationEngine', () => {
  let engine: AutomationEngine;

  beforeEach(() => {
    engine = new AutomationEngine();
  });

  describe('Rule Management', () => {
    it('должен зарегистрировать правило', () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'event', event: 'test.event' },
        actions: [{ type: 'create_entity', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const retrieved = engine.getRule('test-rule-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Rule');
    });

    it('должен удалить правило', () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'event', event: 'test.event' },
        actions: [{ type: 'create_entity', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);
      engine.unregisterRule('test-rule-1');

      const retrieved = engine.getRule('test-rule-1');
      expect(retrieved).toBeUndefined();
    });

    it('должен обновить правило', () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'event', event: 'test.event' },
        actions: [{ type: 'create_entity', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);
      engine.updateRule('test-rule-1', { name: 'Updated Rule', enabled: false });

      const retrieved = engine.getRule('test-rule-1');
      expect(retrieved?.name).toBe('Updated Rule');
      expect(retrieved?.enabled).toBe(false);
    });

    it('должен переключить статус правила', () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'event', event: 'test.event' },
        actions: [{ type: 'create_entity', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);
      engine.toggleRule('test-rule-1', false);

      const retrieved = engine.getRule('test-rule-1');
      expect(retrieved?.enabled).toBe(false);
    });
  });

  describe('Condition Checking', () => {
    describe('Base Conditions', () => {
      it('должен проверить условие equals', () => {
        const condition: Condition = { type: 'equals', field: 'amount', value: 100 };
        const data = { amount: 100 };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить условие not_equals', () => {
        const condition: Condition = { type: 'not_equals', field: 'status', value: 'active' };
        const data = { status: 'inactive' };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить условие greater_than', () => {
        const condition: Condition = { type: 'greater_than', field: 'amount', value: 100 };
        const data = { amount: 150 };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить условие less_than', () => {
        const condition: Condition = { type: 'less_than', field: 'amount', value: 100 };
        const data = { amount: 50 };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить условие contains', () => {
        const condition: Condition = { type: 'contains', field: 'name', value: 'test' };
        const data = { name: 'this is a test' };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить условие exists', () => {
        const condition: Condition = { type: 'exists', field: 'value' };
        const data = { value: 123 };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить условие not_exists', () => {
        const condition: Condition = { type: 'not_exists', field: 'deleted' };
        const data = { name: 'test' };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });
    });

    describe('Logical Conditions', () => {
      it('должен проверить AND условие', () => {
        const condition: Condition = {
          type: 'and',
          conditions: [
            { type: 'equals', field: 'a', value: 1 },
            { type: 'equals', field: 'b', value: 2 },
          ],
        };
        const data = { a: 1, b: 2 };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить OR условие', () => {
        const condition: Condition = {
          type: 'or',
          conditions: [
            { type: 'equals', field: 'a', value: 1 },
            { type: 'equals', field: 'b', value: 2 },
          ],
        };
        const data = { a: 5, b: 2 };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });

      it('должен проверить NOT условие', () => {
        const condition: Condition = {
          type: 'not',
          conditions: [{ type: 'equals', field: 'status', value: 'error' }],
        };
        const data = { status: 'success' };

        const result = engine.checkCondition(condition, data);

        expect(result.matches).toBe(true);
      });
    });

    describe('Multiple Conditions', () => {
      it('должен проверить несколько условий (все должны выполниться)', () => {
        const conditions: Condition[] = [
          { type: 'greater_than', field: 'amount', value: 100 },
          { type: 'equals', field: 'type', value: 'expense' },
        ];
        const data = { amount: 150, type: 'expense' };

        const result = engine.checkConditions(conditions, data);

        expect(result.matches).toBe(true);
      });

      it('должен вернуть false если одно условие не выполнено', () => {
        const conditions: Condition[] = [
          { type: 'greater_than', field: 'amount', value: 100 },
          { type: 'equals', field: 'type', value: 'expense' },
        ];
        const data = { amount: 150, type: 'income' };

        const result = engine.checkConditions(conditions, data);

        expect(result.matches).toBe(false);
      });
    });
  });

  describe('Action Execution', () => {
    it('должен выполнить действие create_entity', async () => {
      const action: ActionConfig = {
        type: 'create_entity',
        entity_type: 'transactions',
        data: { amount: 100, type: 'expense' },
      };

      const context = {
        rule_id: 'test-rule',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      const result = await engine.executeAction(action, context);

      expect(result.success).toBe(true);
    });

    it('должен выполнить действие update_entity', async () => {
      const action: ActionConfig = {
        type: 'update_entity',
        entity_type: 'habits',
        entity_id: 'habit-1',
        data: { completed: true },
      };

      const context = {
        rule_id: 'test-rule',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      const result = await engine.executeAction(action, context);

      expect(result.success).toBe(true);
    });

    it('должен выполнить действие delete_entity', async () => {
      const action: ActionConfig = {
        type: 'delete_entity',
        entity_type: 'notes',
        entity_id: 'note-1',
      };

      const context = {
        rule_id: 'test-rule',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      const result = await engine.executeAction(action, context);

      expect(result.success).toBe(true);
    });

    it('должен выполнить действие send_notification', async () => {
      const action: ActionConfig = {
        type: 'send_notification',
        data: {
          title: 'Test Notification',
          body: 'This is a test',
        },
      };

      const context = {
        rule_id: 'test-rule',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      const result = await engine.executeAction(action, context);

      expect(result.success).toBe(true);
    });
  });

  describe('Rule Execution', () => {
    it('должен выполнить правило при триггере', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: { amount: 100 } }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      const log = await engine.runRule(rule, context);

      expect(log.status).toBe('completed');
      expect(log.actions_executed).toBe(1);
    });

    it('должен пропустить правило если условия не выполнены', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        conditions: [{ type: 'greater_than', field: 'amount', value: 100 }],
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: { amount: 50 },
        timestamp: Date.now(),
      };

      const log = await engine.runRule(rule, context);

      expect(log.status).toBe('skipped');
    });

    it('должен выполнить правило если условия выполнены', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        conditions: [{ type: 'greater_than', field: 'amount', value: 100 }],
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: { amount: 150 },
        timestamp: Date.now(),
      };

      const log = await engine.runRule(rule, context);

      expect(log.status).toBe('completed');
    });
  });

  describe('Cooldown', () => {
    it('должен соблюдать cooldown между запусками', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: {} }],
        priority: 50,
        cooldown_ms: 1000,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context1 = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      // Первый запуск
      await engine.runRule(rule, context1);

      // Второй запуск сразу (должен быть пропущен)
      const log2 = await engine.runRule(rule, context1);

      expect(log2.status).toBe('skipped');
    });
  });

  describe('Run Once', () => {
    it('должен выполнить правило только один раз', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: {} }],
        priority: 50,
        run_once: true,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      // Первый запуск
      await engine.runRule(rule, context);

      // Второй запуск (должен быть пропущен)
      const log2 = await engine.runRule(rule, context);

      expect(log2.status).toBe('skipped');
    });
  });

  describe('Event Triggering', () => {
    it('должен запустить правила при событии', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'event', event: 'transaction.created' },
        actions: [{ type: 'create_entity', entity_type: 'notifications', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const logs = await engine.triggerByEvent('transaction.created', { amount: 100 });

      expect(logs.length).toBe(1);
      expect(logs[0].status).toBe('completed');
    });

    it('должен запустить правила в порядке приоритета', async () => {
      const rule1: AutomationRule = {
        id: 'test-rule-1',
        name: 'Low Priority',
        enabled: true,
        trigger: { type: 'event', event: 'test.event' },
        actions: [{ type: 'create_entity', entity_type: 'test', data: {} }],
        priority: 10,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      const rule2: AutomationRule = {
        id: 'test-rule-2',
        name: 'High Priority',
        enabled: true,
        trigger: { type: 'event', event: 'test.event' },
        actions: [{ type: 'create_entity', entity_type: 'test', data: {} }],
        priority: 90,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule1);
      engine.registerRule(rule2);

      const logs = await engine.triggerByEvent('test.event', {});

      expect(logs[0].rule_id).toBe('test-rule-2'); // Высокий приоритет первый
      expect(logs[1].rule_id).toBe('test-rule-1');
    });
  });

  describe('Logging', () => {
    it('должен сохранить лог выполнения', async () => {
      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      await engine.runRule(rule, context);

      const logs = engine.getLogs();

      expect(logs.length).toBe(1);
      expect(logs[0].rule_id).toBe('test-rule-1');
      expect(logs[0].status).toBe('completed');
    });

    it('должен ограничивать количество логов', async () => {
      // Устанавливаем лимит через приватное свойство для теста
      (engine as any).maxLogs = 5;

      const rule: AutomationRule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        enabled: true,
        trigger: { type: 'manual' },
        actions: [{ type: 'create_entity', entity_type: 'transactions', data: {} }],
        priority: 50,
        created_at: Date.now(),
        updated_at: Date.now(),
        trigger_count: 0,
        error_count: 0,
      };

      engine.registerRule(rule);

      const context = {
        rule_id: 'test-rule-1',
        triggered_by: 'manual' as const,
        payload: {},
        timestamp: Date.now(),
      };

      // Выполняем 10 раз
      for (let i = 0; i < 10; i++) {
        await engine.runRule(rule, context);
      }

      const logs = engine.getLogs(100);

      expect(logs.length).toBeLessThanOrEqual(5);
    });
  });
});
