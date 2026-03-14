'use client';

import * as React from 'react';
import type { AutomationLog } from '@/core/automation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/components/table';
import { Badge } from '@/ui/components/badge';
import { Button } from '@/ui/components/button';
import { EmptyState } from '@/ui/components/empty-state';
import { Clock, CheckCircle, XCircle, StopCircle, AlertTriangle } from 'lucide-react';

interface AutomationLogsTableProps {
  logs: AutomationLog[];
  onViewDetails?: (log: AutomationLog) => void;
}

const statusConfig: Record<
  AutomationLog['status'],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: 'default' | 'success' | 'destructive' | 'info' | 'outline';
  }
> = {
  pending: {
    label: 'Ожидание',
    icon: Clock,
    variant: 'outline',
  },
  running: {
    label: 'Выполняется',
    icon: Clock,
    variant: 'default',
  },
  completed: {
    label: 'Завершено',
    icon: CheckCircle,
    variant: 'success',
  },
  failed: {
    label: 'Ошибка',
    icon: XCircle,
    variant: 'destructive',
  },
  skipped: {
    label: 'Пропущено',
    icon: StopCircle,
    variant: 'outline',
  },
};

export function AutomationLogsTable({
  logs,
  onViewDetails,
}: AutomationLogsTableProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Нет логов"
        description="Логи выполнения правил появятся здесь"
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Статус</TableHead>
            <TableHead>Правило</TableHead>
            <TableHead>Триггер</TableHead>
            <TableHead>Время начала</TableHead>
            <TableHead>Длительность</TableHead>
            <TableHead>Действия</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const config = statusConfig[log.status];
            const Icon = config.icon;

            const duration = log.completed_at
              ? log.completed_at - log.started_at
              : null;

            return (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant={config.variant} className="gap-1">
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{log.rule_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {log.triggered_by === 'manual'
                      ? 'Ручной'
                      : log.triggered_by === ('schedule' as never)
                        ? 'Расписание'
                        : log.triggered_by}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(log.started_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {duration !== null
                    ? `${(duration / 1000).toFixed(2)}s`
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <span className="text-green-600 font-medium">
                        {log.actions_executed}
                      </span>
                      {' / '}
                      <span className="text-red-600 font-medium">
                        {log.actions_failed}
                      </span>
                    </span>
                    {log.error && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {onViewDetails && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(log)}
                    >
                      Детали
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
