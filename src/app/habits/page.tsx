'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, CheckCircle2, Circle, Flame, TrendingUp, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  streak: number;
  completed: number;
  color?: string;
}

const mockHabits: Habit[] = [
  { id: '1', name: 'Чтение книг', frequency: 'daily', target: 30, streak: 7, completed: 15, color: 'blue' },
  { id: '2', name: 'Спорт', frequency: 'daily', target: 30, streak: 3, completed: 10, color: 'green' },
  { id: '3', name: 'Медитация', frequency: 'daily', target: 30, streak: 12, completed: 20, color: 'purple' },
];

export default function HabitsPage() {
  const { t } = useTranslation();
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const totalCompleted = habits.reduce((sum, h) => sum + h.completed, 0);
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgCompletion = habits.length > 0 ? Math.round(totalCompleted / habits.length) : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newHabit: Habit = {
      id: editingHabit?.id || Date.now().toString(),
      name: formData.get('name') as string,
      frequency: formData.get('frequency') as 'daily' | 'weekly' | 'monthly',
      target: Number(formData.get('target')),
      streak: editingHabit?.streak || 0,
      completed: editingHabit?.completed || 0,
      color: editingHabit?.color,
    };

    if (editingHabit) {
      setHabits(habits.map(h => h.id === editingHabit.id ? newHabit : h));
    } else {
      setHabits([...habits, newHabit]);
    }

    setIsDialogOpen(false);
    setEditingHabit(null);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completed: h.completed + 1,
          streak: h.streak + 1,
        };
      }
      return h;
    }));
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.habits')}</h1>
            <p className="text-muted-foreground">{t('habits.today')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingHabit(null)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingHabit ? t('common.edit') : t('habits.addHabit')}
                </DialogTitle>
                <DialogDescription>
                  {t('habits.addHabit')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  label={t('habits.habitName')}
                  defaultValue={editingHabit?.name}
                  required
                />
                <Select
                  name="frequency"
                  label={t('habits.frequency')}
                  defaultValue={editingHabit?.frequency || 'daily'}
                  options={[
                    { value: 'daily', label: t('habits.daily') },
                    { value: 'weekly', label: t('habits.weekly') },
                    { value: 'monthly', label: t('habits.monthly') },
                  ]}
                />
                <Input
                  name="target"
                  type="number"
                  label={t('habits.target')}
                  defaultValue={editingHabit?.target}
                  required
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingHabit ? t('common.update') : t('common.create')}
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
              <CardTitle className="text-sm font-medium">{t('habits.completed')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompleted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('habits.streak')}</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStreak}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('habits.completionRate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCompletion}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Habits List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center text-muted-foreground py-8">
                {t('common.noData')}
              </CardContent>
            </Card>
          ) : (
            habits.map((habit) => (
              <Card key={habit.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{habit.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {t(`habits.${habit.frequency}`)} • {t('habits.target')}: {habit.target}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(habit)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(habit.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">{habit.streak} {t('habits.streak')}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {habit.completed} / {habit.target}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((habit.completed / habit.target) * 100, 100)}%` }}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => toggleHabit(habit.id)}
                    variant="outline"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t('habits.markComplete')}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
