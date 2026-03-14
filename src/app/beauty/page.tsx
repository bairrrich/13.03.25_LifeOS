'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Sparkles, Trash2, Pencil, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/ui/components/badge';

interface Cosmetic {
  id: string;
  name: string;
  brand?: string;
  category: 'skincare' | 'haircare' | 'makeup' | 'fragrance' | 'body';
  expirationDate?: number;
  openedAt?: number;
  notes?: string;
}

interface Routine {
  id: string;
  name: string;
  type: 'morning' | 'evening' | 'weekly';
  steps: RoutineStep[];
  completedToday: boolean;
}

interface RoutineStep {
  id: string;
  name: string;
  cosmeticId?: string;
  duration?: number;
}

const mockCosmetics: Cosmetic[] = [
  { id: '1', name: 'Увлажняющий крем', brand: 'CeraVe', category: 'skincare', openedAt: Date.now() - 2592000000 },
  { id: '2', name: 'Шампунь', brand: 'Head & Shoulders', category: 'haircare' },
  { id: '3', name: 'Парфюм', brand: 'Dior', category: 'fragrance' },
];

const mockRoutines: Routine[] = [
  {
    id: '1',
    name: 'Утренняя рутина',
    type: 'morning',
    steps: [
      { id: '1', name: 'Очищение', duration: 2 },
      { id: '2', name: 'Тонизирование', duration: 1 },
      { id: '3', name: 'Увлажнение', cosmeticId: '1', duration: 2 },
    ],
    completedToday: false,
  },
  {
    id: '2',
    name: 'Вечерняя рутина',
    type: 'evening',
    steps: [
      { id: '4', name: 'Демакияж', duration: 3 },
      { id: '5', name: 'Очищение', duration: 2 },
      { id: '6', name: 'Сыворотка', duration: 2 },
    ],
    completedToday: true,
  },
];

export default function BeautyPage() {
  const { t } = useTranslation();
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>(mockCosmetics);
  const [routines, setRoutines] = useState<Routine[]>(mockRoutines);
  const [isCosmeticDialogOpen, setIsCosmeticDialogOpen] = useState(false);
  const [isRoutineDialogOpen, setIsRoutineDialogOpen] = useState(false);

  const totalCosmetics = cosmetics.length;
  const completedRoutines = routines.filter(r => r.completedToday).length;
  const expiringSoon = cosmetics.filter(c => {
    if (!c.expirationDate) return false;
    const daysUntil = (c.expirationDate - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntil < 30;
  }).length;

  const handleAddCosmetic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCosmetic: Cosmetic = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as Cosmetic['category'],
      notes: formData.get('notes') as string,
    };
    setCosmetics([...cosmetics, newCosmetic]);
    setIsCosmeticDialogOpen(false);
  };

  const handleAddRoutine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoutine: Routine = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as Routine['type'],
      steps: [],
      completedToday: false,
    };
    setRoutines([...routines, newRoutine]);
    setIsRoutineDialogOpen(false);
  };

  const toggleRoutine = (id: string) => {
    setRoutines(routines.map(r => {
      if (r.id === id) {
        return { ...r, completedToday: !r.completedToday };
      }
      return r;
    }));
  };

  const handleDelete = (id: string, type: 'cosmetic' | 'routine') => {
    if (type === 'cosmetic') {
      setCosmetics(cosmetics.filter(c => c.id !== id));
    } else {
      setRoutines(routines.filter(r => r.id !== id));
    }
  };

  const getCategoryEmoji = (category: Cosmetic['category']) => {
    const emojis = { skincare: '🧴', haircare: '💇', makeup: '💄', fragrance: '🌸', body: '🛁' };
    return emojis[category];
  };

  const getTypeBadge = (type: Routine['type']) => {
    const variants: Record<string, 'default' | 'outline'> = {
      morning: 'default',
      evening: 'outline',
      weekly: 'outline',
    };
    const labels = { morning: t('beauty.morning'), evening: t('beauty.evening'), weekly: t('beauty.weekly') };
    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU');
  };

  const daysUntilExpiration = (timestamp: number) => {
    return Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.beauty')}</h1>
            <p className="text-muted-foreground">{t('beauty.routines')}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCosmeticDialogOpen} onOpenChange={setIsCosmeticDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('beauty.addProduct')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('beauty.addProduct')}</DialogTitle>
                  <DialogDescription>{t('beauty.addProduct')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCosmetic} className="space-y-4">
                  <Input name="name" label={t('beauty.productName')} required />
                  <Input name="brand" label={t('beauty.brand')} />
                  <Select
                    name="category"
                    label={t('beauty.category')}
                    options={[
                      { value: 'skincare', label: '🧴 Skincare' },
                      { value: 'haircare', label: '💇 Haircare' },
                      { value: 'makeup', label: '💄 Makeup' },
                      { value: 'fragrance', label: '🌸 Fragrance' },
                      { value: 'body', label: '🛁 Body' },
                    ]}
                  />
                  <Input name="notes" label={t('finance.description')} />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsCosmeticDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('common.create')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isRoutineDialogOpen} onOpenChange={setIsRoutineDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('beauty.addRoutine')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('beauty.addRoutine')}</DialogTitle>
                  <DialogDescription>{t('beauty.addRoutine')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddRoutine} className="space-y-4">
                  <Input name="name" label={t('beauty.addRoutine')} required />
                  <Select
                    name="type"
                    label={t('habits.frequency')}
                    options={[
                      { value: 'morning', label: t('beauty.morning') },
                      { value: 'evening', label: t('beauty.evening') },
                      { value: 'weekly', label: t('beauty.weekly') },
                    ]}
                  />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsRoutineDialogOpen(false)}>
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
              <CardTitle className="text-sm font-medium">{t('beauty.products')}</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCosmetics}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('beauty.routines')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRoutines} / {routines.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('beauty.expiringSoon')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{expiringSoon}</div>
            </CardContent>
          </Card>
        </div>

        {/* Routines */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('beauty.routines')}</h2>
          {routines.map((routine) => (
            <Card key={routine.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {routine.completedToday ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle>{routine.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <CardDescription className="text-xs">
                          {routine.steps.length} {t('beauty.steps')}
                        </CardDescription>
                        {getTypeBadge(routine.type)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={routine.completedToday ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleRoutine(routine.id)}
                    >
                      {routine.completedToday ? '✓' : '○'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(routine.id, 'routine')}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {routine.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        {step.name}
                      </span>
                      {step.duration && (
                        <span className="text-xs text-muted-foreground">{step.duration} {t('beauty.minutes')}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cosmetics */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('beauty.cosmetics')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {cosmetics.map((cosmetic) => {
              const daysLeft = cosmetic.openedAt ? daysUntilExpiration(cosmetic.openedAt + 180 * 24 * 60 * 60 * 1000) : null;
              return (
                <Card key={cosmetic.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryEmoji(cosmetic.category)}</span>
                        <div>
                          <CardTitle className="text-base">{cosmetic.name}</CardTitle>
                          <CardDescription className="text-xs">{cosmetic.brand}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cosmetic.id, 'cosmetic')}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline">{t(`beauty.${cosmetic.category}`)}</Badge>
                    {daysLeft !== null && daysLeft < 30 && (
                      <p className="text-xs text-orange-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {daysLeft} {t('beauty.daysLeft')}
                      </p>
                    )}
                    {cosmetic.notes && (
                      <p className="text-xs text-muted-foreground">{cosmetic.notes}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
