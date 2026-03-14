'use client';

import * as React from 'react';
import type { AutomationRule, TriggerType, Condition, ActionConfig, LogicalCondition, BaseCondition } from '@/core/automation';
import { Card, CardContent } from '@/ui/components/card';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { Label } from '@/ui/components/label';
import { Textarea } from '@/ui/components/textarea';
import { Switch } from '@/ui/components/switch';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '@/shared/lib/use-translation';

/**
 * Type guard для логических условий
 */
function isLogicalCondition(condition: Condition): condition is LogicalCondition {
  return condition.type === 'and' || condition.type === 'or' || condition.type === 'not';
}

interface AutomationRuleFormProps {
  rule?: AutomationRule;
  onSave: (rule: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'trigger_count' | 'error_count'>) => void;
  onCancel: () => void;
}

export function AutomationRuleForm({
  rule,
  onSave,
  onCancel,
}: AutomationRuleFormProps) {
  const { t } = useTranslation();

  const [name, setName] = React.useState(rule?.name ?? '');
  const [description, setDescription] = React.useState(rule?.description ?? '');
  const [enabled, setEnabled] = React.useState(rule?.enabled ?? true);
  const [triggerType, setTriggerType] = React.useState<TriggerType>(
    rule?.trigger.type ?? 'event'
  );
  const [selectedEvent, setSelectedEvent] = React.useState(
    rule?.trigger.event ?? ''
  );
  const [cronExpression, setCronExpression] = React.useState(
    rule?.trigger.schedule?.cron ?? ''
  );
  const [priority, setPriority] = React.useState(rule?.priority ?? 50);
  const [runOnce, setRunOnce] = React.useState(rule?.run_once ?? false);
  const [cooldownMs, setCooldownMs] = React.useState(rule?.cooldown_ms ?? 0);
  const [conditions, setConditions] = React.useState<Condition[]>(
    rule?.conditions ?? []
  );
  const [actions, setActions] = React.useState<ActionConfig[]>(
    rule?.actions ?? []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert(t('automation.form.name'));
      return;
    }

    if (actions.length === 0) {
      alert(t('automation.form.noActions'));
      return;
    }

    const trigger: AutomationRule['trigger'] = {
      type: triggerType,
      event: triggerType === 'event' ? (selectedEvent as never) : undefined,
      schedule:
        triggerType === 'schedule'
          ? { cron: cronExpression, enabled: true }
          : undefined,
    };

    onSave({
      name,
      description: description || undefined,
      enabled,
      trigger,
      conditions: conditions.length > 0 ? conditions : undefined,
      actions,
      priority,
      run_once: runOnce ? true : undefined,
      cooldown_ms: cooldownMs > 0 ? cooldownMs : undefined,
    });
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { type: 'equals', field: '', value: '' },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (
    index: number,
    updates: Partial<Condition>
  ) => {
    setConditions(
      conditions.map((cond, i) =>
        i === index ? { ...cond, ...updates } : cond
      )
    );
  };

  const addAction = () => {
    setActions([...actions, { type: 'create_entity', data: {} }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (
    index: number,
    updates: Partial<ActionConfig>
  ) => {
    setActions(
      actions.map((action, i) =>
        i === index ? { ...action, ...updates } : action
      )
    );
  };

  // Переводы для типов триггеров
  const triggerTypeLabels: Record<TriggerType, string> = {
    event: t('automation.form.event'),
    schedule: t('automation.form.schedule'),
    condition: t('automation.form.conditions'),
    manual: t('automation.logsTable.manual'),
  };

  // Переводы для типов условий
  const conditionTypeLabels: Record<string, string> = {
    equals: `= ${t('common.equal', 'Равно')}`,
    not_equals: `≠ ${t('common.notEqual', 'Не равно')}`,
    greater_than: `> ${t('common.greaterThan', 'Больше')}`,
    less_than: `< ${t('common.lessThan', 'Меньше')}`,
    contains: t('common.contains', 'Содержит'),
    exists: t('common.exists', 'Существует'),
  };

  // Переводы для типов действий
  const actionTypeLabels: Record<string, string> = {
    create_entity: t('automation.actions.createEntity', 'Создать сущность'),
    update_entity: t('automation.actions.updateEntity', 'Обновить сущность'),
    delete_entity: t('automation.actions.deleteEntity', 'Удалить сущность'),
    send_notification: t('automation.actions.sendNotification', 'Уведомление'),
    webhook: 'Webhook',
  };

  // Переводы для типов событий
  const eventLabels: Record<string, string> = {
    'transaction.created': t('automation.events.transactionCreated'),
    'transaction.updated': t('automation.events.transactionUpdated'),
    'habit.completed': t('automation.events.habitCompleted'),
    'workout.completed': t('automation.events.workoutCompleted'),
    'goal.completed': t('automation.events.goalCompleted'),
    'budget.created': t('automation.events.budgetCreated'),
  };

  // Переводы для пресетов cron
  const cronPresetLabels = {
    '* * * * *': t('automation.form.cronPresets.everyMinute'),
    '*/5 * * * *': t('automation.form.cronPresets.every5Minutes'),
    '0 * * * *': t('automation.form.cronPresets.everyHour'),
    '0 0 * * *': t('automation.form.cronPresets.everyDayMidnight'),
    '0 0 * * 1': t('automation.form.cronPresets.everyWeekMonday'),
    '0 0 1 * *': t('automation.form.cronPresets.everyMonth1st'),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="name">{t('automation.form.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('automation.form.namePlaceholder')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">{t('automation.form.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('automation.form.descriptionPlaceholder')}
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <Label htmlFor="enabled">{t('automation.form.enabled')}</Label>
          </div>
        </CardContent>
      </Card>

      {/* Trigger Configuration */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('automation.form.trigger')}</h3>

          <div>
            <Label htmlFor="triggerType">{t('automation.form.triggerType')}</Label>
            <select
              id="triggerType"
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as TriggerType)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {(['event', 'schedule', 'condition', 'manual'] as TriggerType[]).map((type) => (
                <option key={type} value={type}>
                  {triggerTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          {triggerType === 'event' && (
            <div>
              <Label htmlFor="event">{t('automation.form.event')}</Label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t('automation.form.selectEvent')}</option>
                {EVENT_TYPES.map((event) => (
                  <option key={event} value={event}>
                    {eventLabels[event] || event}
                  </option>
                ))}
              </select>
            </div>
          )}

          {triggerType === 'schedule' && (
            <div className="space-y-2">
              <Label htmlFor="cron">{t('automation.form.cronExpression')}</Label>
              <div className="flex gap-2">
                <Input
                  id="cron"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  placeholder="* * * * *"
                  className="flex-1"
                />
                <select
                  value={cronPresetLabels[cronExpression as keyof typeof cronPresetLabels] ? 'preset' : ''}
                  onChange={(e) => {
                    if (e.target.value !== 'preset') {
                      setCronExpression(e.target.value);
                    }
                  }}
                  className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">{t('automation.form.cronPreset')}</option>
                  {Object.entries(cronPresetLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('automation.form.cronFormat')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('automation.form.conditions')}</h3>
            <Button type="button" size="sm" variant="outline" onClick={addCondition}>
              <Plus className="h-4 w-4 mr-1" />
              {t('automation.form.addCondition')}
            </Button>
          </div>

          {conditions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('automation.form.noConditions')}
            </p>
          ) : (
            <div className="space-y-2">
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded">
                  <select
                    value={condition.type}
                    onChange={(e) =>
                      updateCondition(index, { type: e.target.value as Condition['type'] })
                    }
                    className="flex h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.entries(conditionTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {condition.type !== 'exists' && !isLogicalCondition(condition) && (
                    <>
                      <Input
                        placeholder={t('automation.form.field')}
                        value={(condition as BaseCondition).field ?? ''}
                        onChange={(e) =>
                          updateCondition(index, { field: e.target.value })
                        }
                        className="flex-1"
                      />

                      <Input
                        placeholder={t('automation.form.value')}
                        value={String((condition as BaseCondition).value ?? '')}
                        onChange={(e) =>
                          updateCondition(index, { value: e.target.value })
                        }
                        className="flex-1"
                      />
                    </>
                  )}

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCondition(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('automation.form.actions')}</h3>
            <Button type="button" size="sm" variant="outline" onClick={addAction}>
              <Plus className="h-4 w-4 mr-1" />
              {t('automation.form.addAction')}
            </Button>
          </div>

          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('automation.form.noActions')}
            </p>
          ) : (
            <div className="space-y-2">
              {actions.map((action, index) => (
                <div key={index} className="p-3 bg-muted rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={action.type}
                      onChange={(e) =>
                        updateAction(index, { type: e.target.value as ActionConfig['type'] })
                      }
                      className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {Object.entries(actionTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeAction(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    placeholder='{"key": "value"}'
                    value={JSON.stringify(action.data ?? {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const data = JSON.parse(e.target.value);
                        updateAction(index, { data });
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    className="font-mono text-xs"
                    rows={4}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('automation.form.advanced')}</h3>

          <div>
            <Label htmlFor="priority">{t('automation.form.priority')}</Label>
            <Input
              id="priority"
              type="number"
              min={0}
              max={100}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="runOnce"
              checked={runOnce}
              onCheckedChange={setRunOnce}
            />
            <Label htmlFor="runOnce">{t('automation.form.runOnce')}</Label>
          </div>

          <div>
            <Label htmlFor="cooldown">{t('automation.form.cooldown')}</Label>
            <Input
              id="cooldown"
              type="number"
              min={0}
              value={cooldownMs}
              onChange={(e) => setCooldownMs(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}

const EVENT_TYPES = [
  'transaction.created',
  'transaction.updated',
  'habit.completed',
  'workout.completed',
  'goal.completed',
  'budget.created',
];
