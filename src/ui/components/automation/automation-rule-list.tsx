'use client';

import * as React from 'react';
import type { AutomationRule } from '@/core/automation';
import { AutomationRuleCard } from './automation-rule-card';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { EmptyState } from '@/ui/components/empty-state';
import { Plus, Search, Zap } from 'lucide-react';

interface AutomationRuleListProps {
  rules: AutomationRule[];
  onToggle?: (ruleId: string, enabled: boolean) => void;
  onEdit?: (rule: AutomationRule) => void;
  onDelete?: (ruleId: string) => void;
  onRun?: (ruleId: string) => void;
  onCreate?: () => void;
}

export function AutomationRuleList({
  rules,
  onToggle,
  onEdit,
  onDelete,
  onRun,
  onCreate,
}: AutomationRuleListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterEnabled, setFilterEnabled] = React.useState<'all' | 'active' | 'inactive'>('all');

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterEnabled === 'all' ||
      (filterEnabled === 'active' && rule.enabled) ||
      (filterEnabled === 'inactive' && !rule.enabled);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск правил..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterEnabled}
            onChange={(e) => setFilterEnabled(e.target.value as typeof filterEnabled)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>

          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Создать правило
            </Button>
          )}
        </div>
      </div>

      {/* Rules Grid */}
      {filteredRules.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="Правила не найдены"
          description={
            searchQuery || filterEnabled !== 'all'
              ? 'Измените параметры поиска или фильтра'
              : 'Создайте первое правило автоматизации'
          }
          action={
            onCreate ? (
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Создать правило
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRules.map((rule) => (
            <AutomationRuleCard
              key={rule.id}
              rule={rule}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onRun={onRun}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {rules.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
          <span>Всего правил: {rules.length}</span>
          <span>Активных: {rules.filter((r) => r.enabled).length}</span>
          <span>Неактивных: {rules.filter((r) => !r.enabled).length}</span>
        </div>
      )}
    </div>
  );
}
