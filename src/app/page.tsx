'use client';

import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card';
import { Wallet, Flame, Dumbbell, Moon, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.expenses'),
      value: '0 €',
      icon: Wallet,
      color: 'text-green-500',
    },
    {
      title: t('dashboard.calories'),
      value: '0 kcal',
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      title: t('dashboard.workout'),
      value: '0',
      icon: Dumbbell,
      color: 'text-blue-500',
    },
    {
      title: t('dashboard.sleep'),
      value: '0h',
      icon: Moon,
      color: 'text-purple-500',
    },
    {
      title: t('dashboard.reading'),
      value: '0 min',
      icon: BookOpen,
      color: 'text-yellow-500',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.today')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.welcome')}</CardTitle>
            <CardDescription>
              {t('dashboard.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.welcome')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
