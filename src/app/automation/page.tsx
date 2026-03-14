'use client';

import React from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import {
  AutomationRuleList,
  AutomationRuleForm,
  AutomationStats,
  AutomationLogsTable,
} from '@/ui/components/automation';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/ui/components/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/tabs';
import { Plus, Zap, FileText, Settings2 } from 'lucide-react';
import type { AutomationRule, AutomationLog } from '@/core/automation';
import {
  getAllAutomationRules,
  toggleAutomationRule,
  deleteAutomationRule,
  createAutomationRule,
  updateAutomationRule,
  getAutomationLogs,
} from '@/core/automation';

export default function AutomationPage() {
  const { t } = useTranslation();

  const [rules, setRules] = React.useState<AutomationRule[]>([]);
  const [logs, setLogs] = React.useState<AutomationLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<AutomationRule | null>(null);
  const [activeTab, setActiveTab] = React.useState('rules');

  // Загрузка правил
  const loadRules = React.useCallback(async () => {
    try {
      const allRules = await getAllAutomationRules();
      setRules(allRules);
    } catch (error) {
      console.error(t('automation.errorLoad'), error);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Загрузка логов
  const loadLogs = React.useCallback(async () => {
    try {
      const allLogs = await getAutomationLogs(100);
      setLogs(allLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }, []);

  React.useEffect(() => {
    loadRules();
    loadLogs();
  }, [loadRules, loadLogs]);

  // Обработчики
  const handleCreateRule = async (
    ruleData: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'trigger_count' | 'error_count'>
  ) => {
    try {
      await createAutomationRule(ruleData);
      await loadRules();
      setIsFormOpen(false);
    } catch (error) {
      console.error(t('automation.errorCreate'), error);
      alert(t('automation.errorCreate'));
    }
  };

  const handleUpdateRule = async (
    ruleData: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'trigger_count' | 'error_count'>
  ) => {
    if (!editingRule) return;

    try {
      await updateAutomationRule(editingRule.id, ruleData);
      await loadRules();
      setIsFormOpen(false);
      setEditingRule(null);
    } catch (error) {
      console.error(t('automation.errorUpdate'), error);
      alert(t('automation.errorUpdate'));
    }
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await toggleAutomationRule(ruleId, enabled);
      await loadRules();
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm(t('automation.confirmDelete'))) return;

    try {
      await deleteAutomationRule(ruleId);
      await loadRules();
    } catch (error) {
      console.error(t('automation.errorDelete'), error);
      alert(t('automation.errorDelete'));
    }
  };

  const handleEditRule = (rule: AutomationRule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleRunRule = async (ruleId: string) => {
    // TODO: Implement manual trigger
    alert('Manual trigger will be implemented soon');
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingRule(null);
  };

  const handleViewLogDetails = (log: AutomationLog) => {
    console.log('Log details:', log);
    alert(`Log: ${log.rule_name}\nStatus: ${log.status}\nActions: ${log.actions_executed}/${log.actions_failed}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-7 w-7 text-primary" />
              {t('automation.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('automation.description')}
            </p>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingRule(null)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('automation.createRule')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? t('automation.editRule') : t('automation.createRule')}
                </DialogTitle>
                <DialogDescription>
                  {editingRule
                    ? t('automation.form.description')
                    : t('automation.noRulesDescription')}
                </DialogDescription>
              </DialogHeader>
              <AutomationRuleForm
                rule={editingRule ?? undefined}
                onSave={editingRule ? handleUpdateRule : handleCreateRule}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <AutomationStats rules={rules} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules" className="gap-2">
              <Settings2 className="h-4 w-4" />
              {t('automation.rules')} ({rules.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <FileText className="h-4 w-4" />
              {t('automation.logs')} ({logs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-4">
            <AutomationRuleList
              rules={rules}
              onToggle={handleToggleRule}
              onEdit={handleEditRule}
              onDelete={handleDeleteRule}
              onRun={handleRunRule}
              onCreate={() => {
                setEditingRule(null);
                setIsFormOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <AutomationLogsTable
              logs={logs}
              onViewDetails={handleViewLogDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
