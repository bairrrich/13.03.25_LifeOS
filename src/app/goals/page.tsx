'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Textarea } from '@/ui/components/textarea';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Target, TrendingUp, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '@/ui/components/progress-bar';
import { Badge } from '@/ui/components/badge';
import { cn } from '@/shared/lib/cn';

interface Goal {
  id: string;
  name: string;
  type: 'finance' | 'health' | 'learning' | 'personal';
  targetValue: number;
  currentValue: number;
  deadline?: number;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  description?: string;
}

const mockGoals: Goal[] = [
  { id: '1', name: 'Накопить 5000€', type: 'finance', targetValue: 5000, currentValue: 3250, status: 'active', deadline: Date.now() + 86400000 * 180 },
  { id: '2', name: 'Прочитать 20 книг', type: 'learning', targetValue: 20, currentValue: 12, status: 'active' },
  { id: '3', name: 'Похудеть на 10кг', type: 'health', targetValue: 10, currentValue: 6, status: 'active', deadline: Date.now() + 86400000 * 90 },
];

export default function GoalsPage() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + (g.currentValue / g.targetValue) * 100, 0) / goals.length)
    : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newGoal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as Goal['type'],
      targetValue: Number(formData.get('targetValue')),
      currentValue: Number(formData.get('currentValue')) || 0,
      status: formData.get('status') as Goal['status'],
      description: formData.get('description') as string,
      deadline: editingGoal?.deadline,
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
    } else {
      setGoals([...goals, newGoal]);
    }

    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateProgress = (id: string, newValue: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const updated = { ...g, currentValue: newValue };
        if (newValue >= g.targetValue) {
          updated.status = 'completed';
        }
        return updated;
      }
      return g;
    }));
  };

  const getStatusBadge = (status: Goal['status']) => {
    const variants = {
      active: 'default',
      completed: 'success',
      paused: 'warning',
      abandoned: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {t(`goals.${status}`)}
      </Badge>
    );
  };

  const getTypeIcon = (type: Goal['type']) => {
    switch (type) {
      case 'finance': return '€';
      case 'health': return '❤️';
      case 'learning': return '📚';
      case 'personal': return '🎯';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.goals')}</h1>
            <p className="text-muted-foreground">{t('goals.progress')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGoal(null)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('goals.addGoal')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? t('common.edit') : t('goals.addGoal')}
                </DialogTitle>
                <DialogDescription>
                  {t('goals.addGoal')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input name="name" label={t('goals.goalName')} defaultValue={editingGoal?.name} required />
                  <Select
                    name="type"
                    label={t('goals.goalType')}
                    defaultValue={editingGoal?.type || 'personal'}
                    options={[
                      { value: 'finance', label: t('finance.balance') },
                      { value: 'health', label: t('nav.health') },
                      { value: 'learning', label: t('mind.courses') },
                      { value: 'personal', label: t('goals.goals') },
                    ]}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    name="targetValue"
                    type="number"
                    label={t('goals.targetValue')}
                    defaultValue={editingGoal?.targetValue}
                    required
                  />
                  <Input
                    name="currentValue"
                    type="number"
                    label={t('goals.currentValue')}
                    defaultValue={editingGoal?.currentValue}
                  />
                </div>
                <Select
                  name="status"
                  label={t('goals.status')}
                  defaultValue={editingGoal?.status || 'active'}
                  options={[
                    { value: 'active', label: t('goals.active') },
                    { value: 'completed', label: t('goals.completed') },
                    { value: 'paused', label: t('goals.paused') },
                    { value: 'abandoned', label: t('goals.abandoned') },
                  ]}
                />
                <Textarea
                  name="description"
                  label={t('finance.description')}
                  defaultValue={editingGoal?.description}
                  rows={3}
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingGoal ? t('common.update') : t('common.create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('goals.active')}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('goals.completed')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('habits.completionRate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {goals.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center text-muted-foreground py-8">
                {t('common.noData')}
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => {
              const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
              
              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTypeIcon(goal.type)}</span>
                          <CardTitle>{goal.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {goal.description || t('goals.goals')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {getStatusBadge(goal.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {goal.currentValue} / {goal.targetValue}
                        </span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar value={progress} showLabel={false} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(goal)}
                      >
                        <Pencil className="mr-2 h-3 w-3" />
                        {t('common.edit')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProgress(goal.id, goal.targetValue)}
                        disabled={goal.status === 'completed'}
                      >
                        <CheckCircle2 className="mr-2 h-3 w-3" />
                        {t('habits.markComplete')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
