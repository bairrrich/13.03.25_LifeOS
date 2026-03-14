'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Trash2, Pencil, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/ui/components/badge';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  budget?: number;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Зарплата', type: 'income', icon: '💰', color: 'green' },
  { id: '2', name: 'Фриланс', type: 'income', icon: '💻', color: 'blue' },
  { id: '3', name: 'Еда', type: 'expense', icon: '🍔', color: 'orange', budget: 500 },
  { id: '4', name: 'Транспорт', type: 'expense', icon: '🚗', color: 'purple', budget: 150 },
  { id: '5', name: 'Развлечения', type: 'expense', icon: '🎬', color: 'pink', budget: 200 },
  { id: '6', name: 'Покупки', type: 'expense', icon: '🛍️', color: 'red', budget: 400 },
  { id: '7', name: 'Здоровье', type: 'expense', icon: '🏥', color: 'cyan', budget: 100 },
  { id: '8', name: 'Образование', type: 'expense', icon: '📚', color: 'indigo', budget: 150 },
];

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const filteredCategories = filter === 'all'
    ? categories
    : categories.filter(c => c.type === filter);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newCategory: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'income' | 'expense',
      icon: formData.get('icon') as string || '📁',
      color: formData.get('color') as string,
      budget: Number(formData.get('budget')) || undefined,
    };

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? newCategory : c));
    } else {
      setCategories([...categories, newCategory]);
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const getColorClass = (color?: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-purple-100 text-purple-700',
      pink: 'bg-pink-100 text-pink-700',
      red: 'bg-red-100 text-red-700',
      cyan: 'bg-cyan-100 text-cyan-700',
      indigo: 'bg-indigo-100 text-indigo-700',
    };
    return colors[color || 'gray'] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('finance.categories')}</h1>
            <p className="text-muted-foreground">Управление категориями</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? t('common.edit') : 'Новая категория'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Редактировать категорию' : 'Создать новую категорию'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" label="Название" defaultValue={editingCategory?.name} required />
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    name="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editingCategory?.type || 'expense'}
                  >
                    <option value="expense">{t('finance.expense')}</option>
                    <option value="income">{t('finance.income')}</option>
                  </select>
                  <Input name="icon" label={t('finance.icon')} defaultValue={editingCategory?.icon} placeholder="📁" />
                </div>
                <Input name="color" label={t('finance.color')} type="color" defaultValue={editingCategory?.color || '#3b82f6'} />
                <Input
                  name="budget"
                  type="number"
                  label={t('finance.budgetForExpenses')}
                  defaultValue={editingCategory?.budget}
                  placeholder="0"
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingCategory ? t('common.update') : t('common.create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('finance.all')} ({categories.length})
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('income')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('finance.incomes')} ({incomeCategories.length})
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('expense')}
          >
            <TrendingDown className="mr-2 h-4 w-4" />
            {t('finance.expenses')} ({expenseCategories.length})
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.type === 'income' ? 'success' : 'destructive'}>
                          {category.type === 'income' ? 'Доход' : 'Расход'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(category)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {category.budget && (
                  <div className={`text-sm ${getColorClass(category.color)} px-2 py-1 rounded inline-block`}>
                    Бюджет: {category.budget} €
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.categoryStats')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('finance.incomeCategories')}</p>
                <p className="text-2xl font-bold">{incomeCategories.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('finance.expenseCategories')}</p>
                <p className="text-2xl font-bold">{expenseCategories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
