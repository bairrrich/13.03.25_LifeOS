'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Badge } from '@/ui/components/badge';
import { ProgressBar } from '@/ui/components/progress-bar';
import {
  Wallet, Flame, Dumbbell, Moon, BookOpen, CheckCircle2,
  TrendingUp, TrendingDown, DollarSign, Target, Award, Calendar
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Mock данные для демонстрации
const mockStats = {
  finance: {
    balance: 15420,
    income: 5000,
    expenses: 2340,
    trend: 12.5,
  },
  nutrition: {
    calories: 2100,
    goal: 2500,
    protein: 120,
    carbs: 250,
    fat: 65,
  },
  workouts: {
    completed: 12,
    hours: 18,
    streak: 5,
  },
  habits: {
    completed: 45,
    total: 60,
    rate: 75,
  },
  health: {
    sleep: 7.2,
    weight: 75,
    steps: 8500,
  },
};

const weeklyData = [
  { day: 'Пн', expenses: 320, calories: 2200, workouts: 1 },
  { day: 'Вт', expenses: 180, calories: 2400, workouts: 0 },
  { day: 'Ср', expenses: 450, calories: 2100, workouts: 1 },
  { day: 'Чт', expenses: 290, calories: 2300, workouts: 1 },
  { day: 'Пт', expenses: 520, calories: 2500, workouts: 0 },
  { day: 'Сб', expenses: 380, calories: 2000, workouts: 1 },
  { day: 'Вс', expenses: 200, calories: 2100, workouts: 0 },
];

const categoryData = [
  { name: 'Еда', value: 850, color: '#22c55e' },
  { name: 'Транспорт', value: 320, color: '#3b82f6' },
  { name: 'Развлечения', value: 450, color: '#a855f7' },
  { name: 'Покупки', value: 720, color: '#f97316' },
];

const habitsData = [
  { name: 'Чтение', completed: 25, target: 30 },
  { name: 'Спорт', completed: 18, target: 20 },
  { name: 'Вода', completed: 28, target: 30 },
  { name: 'Медитация', completed: 15, target: 30 },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.today')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('week')}
            >
              {t('habits.weekly')}
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('month')}
            >
              {t('habits.monthly')}
            </Button>
          </div>
        </div>

        {/* Summary Cards - Main Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.expenses')}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.finance.expenses} €</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+{mockStats.finance.trend}%</span>
                <span className="text-muted-foreground">vs прошлой недели</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.calories')}</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.nutrition.calories}</div>
              <p className="text-xs text-muted-foreground">
                из {mockStats.nutrition.goal} kcal
              </p>
              <div className="mt-2">
                <ProgressBar
                  value={(mockStats.nutrition.calories / mockStats.nutrition.goal) * 100}
                  showLabel={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.workout')}</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.workouts.completed}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.workouts.hours} часов за неделю
              </p>
              <div className="flex items-center gap-1 text-xs mt-1">
                <Award className="h-3 w-3 text-orange-500" />
                <span>{mockStats.workouts.streak} дней серия</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.sleep')}</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.health.sleep}h</div>
              <p className="text-xs text-muted-foreground">
                в среднем за ночь
              </p>
              <Badge variant="success" className="mt-1">Норма</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.reading')}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 мин</div>
              <p className="text-xs text-muted-foreground">
                сегодня
              </p>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+12 мин</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Finance Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.balance')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.finance.balance} €</div>
              <div className="flex items-center gap-2 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{mockStats.finance.income}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">-{mockStats.finance.expenses}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('habits.completed')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.habits.completed}/{mockStats.habits.total}</div>
              <ProgressBar value={mockStats.habits.rate} showLabel={false} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.protein')}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.nutrition.protein}g</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.nutrition.carbs}g углеводов • {mockStats.nutrition.fat}g жиров
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Шаги</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.health.steps}</div>
              <p className="text-xs text-muted-foreground">
                ~6.5 км
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Расходы за неделю</CardTitle>
              <CardDescription>Ежедневные расходы</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Categories Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Категории расходов</CardTitle>
              <CardDescription>Распределение по категориям</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Habits Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Прогресс привычек</CardTitle>
            <CardDescription>Выполнение за этот месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habitsData.map((habit) => (
                <div key={habit.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{habit.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {habit.completed} / {habit.target}
                    </span>
                  </div>
                  <ProgressBar
                    value={(habit.completed / habit.target) * 100}
                    showLabel={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Частые операции</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Транзакция
              </Button>
              <Button variant="outline" className="justify-start">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Завершить привычку
              </Button>
              <Button variant="outline" className="justify-start">
                <Utensils className="mr-2 h-4 w-4" />
                Приём пищи
              </Button>
              <Button variant="outline" className="justify-start">
                <Dumbbell className="mr-2 h-4 w-4" />
                Тренировка
              </Button>
              <Button variant="outline" className="justify-start">
                <Moon className="mr-2 h-4 w-4" />
                Записать сон
              </Button>
              <Button variant="outline" className="justify-start">
                <Scale className="mr-2 h-4 w-4" />
                Записать вес
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Utensils = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Scale = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);
