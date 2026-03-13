'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card';
import { Badge } from '@/ui/components/badge';
import { ProgressBar } from '@/ui/components/progress-bar';
import { StatCard } from '@/ui/components/stat-card';
import { Wallet, Flame, CheckCircle } from 'lucide-react';

export default function ThemeVisualTestPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Визуальный тест тем</h1>
        <div className="flex gap-2">
          <Button onClick={() => setTheme('light')}>Light</Button>
          <Button onClick={() => setTheme('dark')}>Dark</Button>
          <Button onClick={() => setTheme('high-contrast')}>High Contrast</Button>
          <Button onClick={() => setTheme('system')}>System</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="info">Info</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Баланс"
          value="€1,234.56"
          description="+20.5% за месяц"
          icon={Wallet}
          trend={{ value: 20.5, label: 'за месяц' }}
        />
        <StatCard
          title="Калории"
          value="2,100 kcal"
          description="Цель: 2,500"
          icon={Flame}
        />
        <StatCard
          title="Привычки"
          value="5/7"
          description="71% выполнено"
          icon={CheckCircle}
        />
        <StatCard
          title="Сон"
          value="7.5 часов"
          description="Вчера"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Прогресс цели</CardTitle>
            <CardDescription>Накопить €5,000</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={65} max={100} showLabel />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>€3,250</span>
              <span>€5,000</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус задачи</CardTitle>
            <CardDescription>Разработка модуля</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={80} variant="success" showLabel />
            <ProgressBar value={50} variant="warning" showLabel />
            <ProgressBar value={25} variant="destructive" showLabel />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Кнопки</CardTitle>
          <CardDescription>Все варианты кнопок</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Текущая тема</CardTitle>
          <CardDescription>Информация о текущей теме</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>theme:</strong> {theme}</p>
            <p className="p-4 bg-primary text-primary-foreground rounded">
              Primary button text
            </p>
            <p className="p-4 bg-secondary text-secondary-foreground rounded">
              Secondary button text
            </p>
            <p className="p-4 bg-muted text-muted-foreground rounded">
              Muted text
            </p>
            <p className="p-4 bg-accent text-accent-foreground rounded">
              Accent text
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
