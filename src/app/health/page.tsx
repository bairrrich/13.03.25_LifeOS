'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Moon, Heart, Scale, Pill, Trash2, Activity } from 'lucide-react';
import { Badge } from '@/ui/components/badge';

interface SleepLog {
  id: string;
  date: number;
  hours: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

interface WeightLog {
  id: string;
  date: number;
  weight: number;
  bodyFat?: number;
}

const mockSleepLogs: SleepLog[] = [
  { id: '1', date: Date.now() - 86400000, hours: 7.5, quality: 'good' },
  { id: '2', date: Date.now() - 172800000, hours: 6.5, quality: 'fair' },
  { id: '3', date: Date.now() - 259200000, hours: 8, quality: 'excellent' },
];

const mockWeightLogs: WeightLog[] = [
  { id: '1', date: Date.now(), weight: 75, bodyFat: 15 },
  { id: '2', date: Date.now() - 604800000, weight: 75.5, bodyFat: 15.5 },
];

export default function HealthPage() {
  const { t } = useTranslation();
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(mockSleepLogs);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(mockWeightLogs);
  const [isSleepDialogOpen, setIsSleepDialogOpen] = useState(false);
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);

  const avgSleep = sleepLogs.length > 0
    ? (sleepLogs.reduce((sum, log) => sum + log.hours, 0) / sleepLogs.length).toFixed(1)
    : 0;

  const currentWeight = weightLogs[0]?.weight || 0;
  const weightChange = weightLogs.length > 1
    ? (weightLogs[0].weight - weightLogs[1].weight).toFixed(1)
    : 0;

  const handleAddSleep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog: SleepLog = {
      id: Date.now().toString(),
      date: Date.now(),
      hours: Number(formData.get('hours')),
      quality: formData.get('quality') as SleepLog['quality'],
    };
    setSleepLogs([newLog, ...sleepLogs]);
    setIsSleepDialogOpen(false);
  };

  const handleAddWeight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog: WeightLog = {
      id: Date.now().toString(),
      date: Date.now(),
      weight: Number(formData.get('weight')),
      bodyFat: Number(formData.get('bodyFat')) || undefined,
    };
    setWeightLogs([newLog, ...weightLogs]);
    setIsWeightDialogOpen(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getQualityEmoji = (quality: SleepLog['quality']) => {
    const emojis = { poor: '😴', fair: '😐', good: '😊', excellent: '🌟' };
    return emojis[quality] || '😐';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.health')}</h1>
            <p className="text-muted-foreground">{t('health.metrics')}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSleepDialogOpen} onOpenChange={setIsSleepDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('health.sleepLog')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('health.sleepLog')}</DialogTitle>
                  <DialogDescription>{t('health.sleepLog')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSleep} className="space-y-4">
                  <Input name="hours" type="number" step="0.5" label={`${t('health.duration')} (часы)`} required />
                  <select name="quality" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="poor">😴 Плохое</option>
                    <option value="fair">😐 Нормальное</option>
                    <option value="good">😊 Хорошее</option>
                    <option value="excellent">🌟 Отличное</option>
                  </select>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsSleepDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('common.create')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('health.weightLog')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('health.weightLog')}</DialogTitle>
                  <DialogDescription>{t('health.weightLog')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddWeight} className="space-y-4">
                  <Input name="weight" type="number" step="0.1" label={`${t('health.weight')} (кг)`} required />
                  <Input name="bodyFat" type="number" step="0.1" label={`${t('health.bodyFat')} (%)`} />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsWeightDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('common.create')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('health.sleep')}</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSleep} ч</div>
              <p className="text-xs text-muted-foreground">За неделю</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('health.weight')}</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentWeight} кг</div>
              <p className="text-xs text-muted-foreground">
                {Number(weightChange) >= 0 ? '+' : ''}{weightChange} кг
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('health.bodyFat')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weightLogs[0]?.bodyFat || '-'}%</div>
              <p className="text-xs text-muted-foreground">Последнее измерение</p>
            </CardContent>
          </Card>
        </div>

        {/* Sleep Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                <CardTitle>{t('health.sleepLog')}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sleepLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getQualityEmoji(log.quality)}</span>
                    <div>
                      <p className="font-medium">{log.hours} часов</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                    </div>
                  </div>
                  <Badge>{log.quality === 'excellent' ? 'Отлично' : log.quality === 'good' ? 'Хорошо' : 'Нормально'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weight Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                <CardTitle>{t('health.weightLog')}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weightLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{log.weight} кг</p>
                    <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                  </div>
                  {log.bodyFat && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{log.bodyFat}%</p>
                      <p className="text-xs text-muted-foreground">{t('health.bodyFat')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
