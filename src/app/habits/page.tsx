'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, CheckCircle2, Circle, Flame, TrendingUp, Trash2, Pencil, Calendar, Award, Target } from 'lucide-react';
import { Badge } from '@/ui/components/badge';
import { ProgressBar } from '@/ui/components/progress-bar';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  streak: number;
  bestStreak: number;
  completed: number;
  completedDates: number[];
  color?: string;
  icon?: string;
}

const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Чтение книг',
    frequency: 'daily',
    target: 30,
    streak: 7,
    bestStreak: 15,
    completed: 18,
    completedDates: [Date.now() - 86400000, Date.now() - 172800000],
    color: 'blue',
    icon: '📚',
  },
  {
    id: '2',
    name: 'Спорт',
    frequency: 'daily',
    target: 20,
    streak: 3,
    bestStreak: 10,
    completed: 10,
    completedDates: [Date.now()],
    color: 'green',
    icon: '💪',
  },
  {
    id: '3',
    name: 'Медитация',
    frequency: 'daily',
    target: 30,
    streak: 12,
    bestStreak: 21,
    completed: 20,
    completedDates: [Date.now()],
    color: 'purple',
    icon: '🧘',
  },
  {
    id: '4',
    name: 'Пить воду',
    frequency: 'daily',
    target: 30,
    streak: 5,
    bestStreak: 14,
    completed: 15,
    completedDates: [],
    color: 'cyan',
    icon: '💧',
  },
];

export default function HabitsPage() {
  const { t } = useTranslation();
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const totalCompleted = habits.reduce((sum, h) => sum + h.completed, 0);
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgCompletion = habits.length > 0 ? Math.round(totalCompleted / habits.length) : 0;
  const today = new Date();
  const currentDay = today.getDay();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newHabit: Habit = {
      id: editingHabit?.id || Date.now().toString(),
      name: formData.get('name') as string,
      frequency: formData.get('frequency') as Habit['frequency'],
      target: Number(formData.get('target')),
      streak: editingHabit?.streak || 0,
      bestStreak: editingHabit?.bestStreak || 0,
      completed: editingHabit?.completed || 0,
      completedDates: editingHabit?.completedDates || [],
      color: editingHabit?.color,
      icon: editingHabit?.icon,
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
        const isCompletedToday = h.completedDates.some(d => {
          const habitDate = new Date(d);
          const todayDate = new Date();
          return habitDate.toDateString() === todayDate.toDateString();
        });

        if (isCompletedToday) {
          return {
            ...h,
            completed: Math.max(0, h.completed - 1),
            streak: Math.max(0, h.streak - 1),
            completedDates: h.completedDates.filter(d => {
              const habitDate = new Date(d);
              const todayDate = new Date();
              return habitDate.toDateString() !== todayDate.toDateString();
            }),
          };
        } else {
          return {
            ...h,
            completed: h.completed + 1,
            streak: h.streak + 1,
            bestStreak: Math.max(h.bestStreak, h.streak + 1),
            completedDates: [...h.completedDates, Date.now()],
          };
        }
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

  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.some(d => {
      const habitDate = new Date(d);
      const todayDate = new Date();
      return habitDate.toDateString() === todayDate.toDateString();
    });
  };

  const getColorClass = (color?: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-purple-100 text-purple-700',
      cyan: 'bg-cyan-100 text-cyan-700',
      orange: 'bg-orange-100 text-orange-700',
      pink: 'bg-pink-100 text-pink-700',
    };
    return colors[color || 'gray'] || 'bg-gray-100 text-gray-700';
  };

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

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
                {t('habits.addHabit')}
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
                <Input name="name" label={t('habits.habitName')} defaultValue={editingHabit?.name} required />
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
        <div className="grid gap-4 md:grid-cols-4">
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
              <div className="text-2xl font-bold">{avgCompletion}{t('units.percent')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('habits.today')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {habits.filter(h => isCompletedToday(h)).length}/{habits.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('habits.weekly')}
            </CardTitle>
            <CardDescription>{t('habits.weeklyProgress')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((date, index) => {
                const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
                const dayNum = date.getDate();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div key={index} className={`text-center p-2 rounded-lg ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <div className="text-xs font-medium">{dayName}</div>
                    <div className="text-lg font-bold">{dayNum}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Habits Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {habits.map((habit) => {
            const progress = Math.min((habit.completed / habit.target) * 100, 100);
            const completedToday = isCompletedToday(habit);

            return (
              <Card key={habit.id} className={completedToday ? 'border-green-500' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{habit.icon}</span>
                      <div>
                        <CardTitle className="text-base">{habit.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{t(`habits.${habit.frequency}`)}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {t('habits.target')}: {habit.target}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleHabit(habit.id)}
                      >
                        {completedToday ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
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
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">
                        {habit.streak} {t('habits.streak')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        {t('habits.bestStreak')}: {habit.bestStreak}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{habit.completed} / {habit.target}</span>
                      <span>{Math.round(progress)}{t('units.percent')}</span>
                    </div>
                    <ProgressBar value={progress} showLabel={false} />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => toggleHabit(habit.id)}
                    variant={completedToday ? 'secondary' : 'default'}
                  >
                    {completedToday ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t('habits.completed')}
                      </>
                    ) : (
                      <>
                        <Circle className="mr-2 h-4 w-4" />
                        {t('habits.markComplete')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
