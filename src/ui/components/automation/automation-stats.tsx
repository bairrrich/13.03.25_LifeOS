'use client';

import * as React from 'react';
import type { AutomationRule } from '@/core/automation';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card';
import { Zap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useTranslation } from '@/shared/lib/use-translation';

interface AutomationStatsProps {
  rules: AutomationRule[];
}

export function AutomationStats({ rules }: AutomationStatsProps) {
  const { t } = useTranslation();

  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.enabled).length;
  const inactiveRules = totalRules - activeRules;
  const totalTriggers = rules.reduce((sum, r) => sum + r.trigger_count, 0);
  const totalErrors = rules.reduce((sum, r) => sum + r.error_count, 0);

  const stats = [
    {
      key: 'totalRules',
      title: t('automation.stats.totalRules'),
      value: totalRules,
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      key: 'activeRules',
      title: t('automation.stats.activeRules'),
      value: activeRules,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      key: 'inactiveRules',
      title: t('automation.stats.inactiveRules'),
      value: inactiveRules,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      key: 'totalTriggers',
      title: t('automation.stats.totalTriggers'),
      value: totalTriggers,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      key: 'totalErrors',
      title: t('automation.stats.totalErrors'),
      value: totalErrors,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.key} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
