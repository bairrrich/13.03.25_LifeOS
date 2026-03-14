'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Dumbbell, Trash2, Pencil, Calendar, Flame } from 'lucide-react';
import { Badge } from '@/ui/components/badge';

interface Workout {
  id: string;
  name: string;
  date: number;
  duration?: number;
  exercises: WorkoutExercise[];
}

interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: SetData[];
}

interface SetData {
  reps: number;
  weight: number;
}

const mockExercises = [
  { id: '1', name: 'Жим лёжа', muscleGroup: 'chest' },
  { id: '2', name: 'Приседания', muscleGroup: 'legs' },
  { id: '3', name: 'Становая тяга', muscleGroup: 'back' },
  { id: '4', name: 'Подтягивания', muscleGroup: 'back' },
];

const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Грудь + Трицепс',
    date: Date.now() - 86400000,
    duration: 60,
    exercises: [
      {
        exerciseId: '1',
        name: 'Жим лёжа',
        sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 85 }, { reps: 6, weight: 90 }],
      },
    ],
  },
];

export default function WorkoutsPage() {
  const { t } = useTranslation();
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => {
    return sum + w.exercises.reduce((eSum, e) => {
      return eSum + e.sets.reduce((sSum, s) => sSum + (s.reps * s.weight), 0);
    }, 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      date: Date.now(),
      duration: Number(formData.get('duration')),
      exercises: [],
    };

    setWorkouts([newWorkout, ...workouts]);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.workouts')}</h1>
            <p className="text-muted-foreground">{t('workouts.workouts')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(false)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('workouts.addWorkout')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('workouts.addWorkout')}</DialogTitle>
                <DialogDescription>{t('workouts.addWorkout')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" label={t('workouts.workoutName')} required />
                <Input name="duration" type="number" label={t('workouts.duration')} />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">{t('common.create')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nav.workouts')}</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkouts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('workouts.duration')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workouts.reduce((sum, w) => sum + (w.duration || 0), 0)} мин</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Объём</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}k кг</div>
            </CardContent>
          </Card>
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <Card>
              <CardContent className="text-center text-muted-foreground py-8">
                {t('common.noData')}
              </CardContent>
            </Card>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{workout.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(workout.date)} • {workout.duration || 0} мин
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(workout.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {workout.exercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет упражнений</p>
                  ) : (
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{exercise.name}</span>
                            <Badge variant="outline">{exercise.sets.length} подходов</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-muted-foreground">Подход</div>
                            <div className="text-muted-foreground">Вес</div>
                            <div className="text-muted-foreground">Повторы</div>
                            {exercise.sets.map((set, setIndex) => (
                              <React.Fragment key={setIndex}>
                                <div>{setIndex + 1}</div>
                                <div>{set.weight} кг</div>
                                <div>{set.reps}</div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Exercises Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('workouts.exercises')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {mockExercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{exercise.muscleGroup}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
