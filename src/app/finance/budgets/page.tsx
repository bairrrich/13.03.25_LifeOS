'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, TrendingUp, Trash2, Pencil, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/ui/components/badge';
import { ProgressBar } from '@/ui/components/progress-bar';

interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: number;
  endDate?: number;
}

const mockBudgets: Budget[] = [
  { id: '1', name: 'Еда', category: 'food', amount: 500, spent: 380, period: 'monthly', startDate: Date.now() - 2592000000 },
  { id: '2', name: 'Транспорт', category: 'transport', amount: 150, spent: 120, period: 'monthly', startDate: Date.now() - 2592000000 },
  { id: '3', name: 'Развлечения', category: 'entertainment', amount: 200, spent: 250, period: 'monthly', startDate: Date.now() - 2592000000 },
  { id: '4', name: 'Покупки', category: 'shopping', amount: 400, spent: 180, period: 'monthly', startDate: Date.now() - 2592000000 },
];

export default function BudgetsPage() {
  const { t } = useTranslation();
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overBudget = budgets.filter(b => b.spent > b.amount).length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newBudget: Budget = {
      id: editingBudget?.id || Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      amount: Number(formData.get('amount')),
      spent: 0,
      period: formData.get('period') as Budget['period'],
      startDate: Date.now(),
    };

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? newBudget : b));
    } else {
      setBudgets([...budgets, newBudget]);
    }

    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const getPeriodLabel = (period: Budget['period']) => {
    const labels = { daily: 'в день', weekly: 'в неделю', monthly: 'в месяц', yearly: 'в год' };
    return labels[period];
  };

  const getStatusBadge = (budget: Budget) => {
    const percent = (budget.spent / budget.amount) * 100;
    if (percent > 100) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Превышен
        </Badge>
      );
    }
    if (percent > 80) {
      return (
        <Badge variant="warning">
          <AlertCircle className="mr-1 h-3 w-3" />
          Почти всё
        </Badge>
      );
    }
    return (
      <Badge variant="success">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        В норме
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('finance.budgets')}</h1>
            <p className="text-muted-foreground">{t('finance.categories')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBudget(null)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('finance.addBudget')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? t('common.edit') : t('finance.addBudget')}
                </DialogTitle>
                <DialogDescription>
                  {t('finance.addBudget')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" label={t('finance.budgets')} defaultValue={editingBudget?.name} required />
                <Input name="category" label={t('finance.category')} defaultValue={editingBudget?.category} required />
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  label={t('finance.amount')}
                  defaultValue={editingBudget?.amount}
                  required
                />
                <Select
                  name="period"
                  label={t('finance.period')}
                  defaultValue={editingBudget?.period || 'monthly'}
                  options={[
                    { value: 'daily', label: t('finance.daily') },
                    { value: 'weekly', label: t('finance.weekly') },
                    { value: 'monthly', label: t('finance.monthly') },
                    { value: 'yearly', label: t('finance.yearly') },
                  ]}
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingBudget ? t('common.update') : t('common.create')}
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
              <CardTitle className="text-sm font-medium">{t('finance.budgetTotal')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBudget.toFixed(0)} €</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.spent')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{totalSpent.toFixed(0)} €</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.remaining')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{remaining.toFixed(0)} €</div>
            </CardContent>
          </Card>
        </div>

        {/* Over Budget Alert */}
        {overBudget > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">{t('finance.overBudget')}</CardTitle>
              </div>
              <CardDescription>
                {overBudget} бюджет(а) превышены
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Budgets List */}
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percent = Math.min((budget.spent / budget.amount) * 100, 100);
            const remaining = budget.amount - budget.spent;

            return (
              <Card key={budget.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{budget.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {budget.category} • {getPeriodLabel(budget.period)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(budget)}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {budget.spent.toFixed(0)} / {budget.amount.toFixed(0)} €
                    </span>
                    <span className="font-medium">{Math.round(percent)}%</span>
                  </div>
                  <ProgressBar
                    value={percent}
                    variant={percent > 100 ? 'destructive' : percent > 80 ? 'warning' : 'default'}
                    showLabel={false}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={remaining >= 0 ? 'text-green-500' : 'text-destructive'}>
                      {remaining >= 0 ? `Осталось: ${remaining.toFixed(0)} €` : `Превышено: ${Math.abs(remaining).toFixed(0)} €`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
