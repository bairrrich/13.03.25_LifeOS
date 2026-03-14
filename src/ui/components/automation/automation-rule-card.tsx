'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card';
import { Button } from '@/ui/components/button';
import { Badge } from '@/ui/components/badge';
import { Switch } from '@/ui/components/switch';
import type { AutomationRule } from '@/core/automation';
import {
  Play,
  Pause,
  Trash2,
  Edit,
  Clock,
  Activity,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface AutomationRuleCardProps {
  rule: AutomationRule;
  onToggle?: (ruleId: string, enabled: boolean) => void;
  onEdit?: (rule: AutomationRule) => void;
  onDelete?: (ruleId: string) => void;
  onRun?: (ruleId: string) => void;
}

export function AutomationRuleCard({
  rule,
  onToggle,
  onEdit,
  onDelete,
  onRun,
}: AutomationRuleCardProps) {
  const triggerTypeLabels: Record<string, string> = {
    event: 'Событие',
    schedule: 'Расписание',
    condition: 'Условие',
    manual: 'Ручной',
  };

  const priorityColor =
    rule.priority >= 80
      ? 'bg-red-500'
      : rule.priority >= 50
        ? 'bg-yellow-500'
        : 'bg-green-500';

  const lastTriggered = rule.last_triggered_at
    ? new Date(rule.last_triggered_at).toLocaleString()
    : 'Никогда';

  return (
    <Card className={`relative ${!rule.enabled ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{rule.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={rule.enabled ? 'success' : 'outline'}>
              {rule.enabled ? 'Активно' : 'Неактивно'}
            </Badge>
            <Switch
              checked={rule.enabled}
              onCheckedChange={(checked) => onToggle?.(rule.id, checked)}
              aria-label="Включить правило"
            />
          </div>
        </div>
        {rule.description && (
          <CardDescription className="mt-1">{rule.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Trigger Info */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Триггер:</span>
            <Badge variant="outline">{triggerTypeLabels[rule.trigger.type]}</Badge>
            {rule.trigger.type === 'event' && rule.trigger.event && (
              <span className="text-muted-foreground">
                {rule.trigger.event}
              </span>
            )}
            {rule.trigger.type === 'schedule' && rule.trigger.schedule?.cron && (
              <code className="text-xs bg-muted px-1 rounded">
                {rule.trigger.schedule.cron}
              </code>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-muted rounded">
              <Activity className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="text-lg font-bold">{rule.trigger_count}</div>
              <div className="text-xs text-muted-foreground">Запусков</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <AlertCircle className="h-4 w-4 mx-auto mb-1 text-destructive" />
              <div className="text-lg font-bold">{rule.error_count}</div>
              <div className="text-xs text-muted-foreground">Ошибок</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className={`h-4 w-4 mx-auto mb-1 rounded-full ${priorityColor}`} />
              <div className="text-lg font-bold">{rule.priority}</div>
              <div className="text-xs text-muted-foreground">Приоритет</div>
            </div>
          </div>

          {/* Last Triggered */}
          <div className="text-xs text-muted-foreground">
            Последний запуск: {lastTriggered}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            {onRun && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRun(rule.id)}
                disabled={!rule.enabled}
                className="flex-1"
              >
                <Play className="h-3 w-3 mr-1" />
                Запустить
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(rule)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(rule.id)}
                className="flex-1"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
