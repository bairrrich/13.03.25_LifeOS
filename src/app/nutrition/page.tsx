'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Utensils, Flame, Trash2, Pencil } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servingSize: number;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  entries: MealEntry[];
}

interface MealEntry {
  foodId: string;
  quantity: number;
}

const mockFoods: Food[] = [
  { id: '1', name: 'Овсянка', calories: 350, protein: 12, fat: 6, carbs: 60, servingSize: 100 },
  { id: '2', name: 'Куриная грудка', calories: 165, protein: 31, fat: 3.6, carbs: 0, servingSize: 100 },
  { id: '3', name: 'Рис', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, servingSize: 100 },
];

const mockMeals: Meal[] = [
  { id: '1', name: 'Завтрак', type: 'breakfast', entries: [{ foodId: '1', quantity: 150 }] },
  { id: '2', name: 'Обед', type: 'lunch', entries: [{ foodId: '2', quantity: 200 }, { foodId: '3', quantity: 150 }] },
];

export default function NutritionPage() {
  const { t } = useTranslation();
  const [foods] = useState<Food[]>(mockFoods);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);

  // Подсчёт калорий за день
  const totalCalories = meals.reduce((sum, meal) => {
    return sum + meal.entries.reduce((mealSum, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      return mealSum + (food ? (food.calories * entry.quantity / 100) : 0);
    }, 0);
  }, 0);

  const totalProtein = meals.reduce((sum, meal) => {
    return sum + meal.entries.reduce((mealSum, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      return mealSum + (food ? (food.protein * entry.quantity / 100) : 0);
    }, 0);
  }, 0);

  const totalFat = meals.reduce((sum, meal) => {
    return sum + meal.entries.reduce((mealSum, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      return mealSum + (food ? (food.fat * entry.quantity / 100) : 0);
    }, 0);
  }, 0);

  const totalCarbs = meals.reduce((sum, meal) => {
    return sum + meal.entries.reduce((mealSum, entry) => {
      const food = foods.find(f => f.id === entry.foodId);
      return mealSum + (food ? (food.carbs * entry.quantity / 100) : 0);
    }, 0);
  }, 0);

  const handleAddFood = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFood: Food = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      calories: Number(formData.get('calories')),
      protein: Number(formData.get('protein')),
      fat: Number(formData.get('fat')),
      carbs: Number(formData.get('carbs')),
      servingSize: Number(formData.get('servingSize')),
    };
    // В реальном приложении здесь было бы сохранение
    console.log('New food:', newFood);
    setIsFoodDialogOpen(false);
  };

  const handleAddMeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as Meal['type'],
      entries: [],
    };
    setMeals([...meals, newMeal]);
    setIsMealDialogOpen(false);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.nutrition')}</h1>
            <p className="text-muted-foreground">{t('nutrition.meals')}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isFoodDialogOpen} onOpenChange={setIsFoodDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('nutrition.addFood')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('nutrition.addFood')}</DialogTitle>
                  <DialogDescription>{t('nutrition.addFood')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddFood} className="space-y-4">
                  <Input name="name" label={t('mind.title')} required />
                  <Input name="calories" type="number" label={t('nutrition.calories')} required />
                  <Input name="protein" type="number" label={t('nutrition.protein')} />
                  <Input name="fat" type="number" label={t('nutrition.fat')} />
                  <Input name="carbs" type="number" label={t('nutrition.carbs')} />
                  <Input name="servingSize" type="number" label={t('nutrition.servingSize')} defaultValue={100} />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsFoodDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('common.create')}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('nutrition.addMeal')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('nutrition.addMeal')}</DialogTitle>
                  <DialogDescription>{t('nutrition.addMeal')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <Input name="name" label={t('nutrition.addMeal')} required />
                  <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="breakfast">{t('nutrition.breakfast')}</option>
                    <option value="lunch">{t('nutrition.lunch')}</option>
                    <option value="dinner">{t('nutrition.dinner')}</option>
                    <option value="snack">{t('nutrition.snack')}</option>
                  </select>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsMealDialogOpen(false)}>
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.calories')}</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalCalories)}</div>
              <p className="text-xs text-muted-foreground">{t('nutrition.consumed')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.protein')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalProtein)}g</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.fat')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalFat)}g</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.carbs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalCarbs)}g</div>
            </CardContent>
          </Card>
        </div>

        {/* Meals List */}
        <div className="grid gap-4">
          {meals.map((meal) => {
            const mealCalories = meal.entries.reduce((sum, entry) => {
              const food = foods.find(f => f.id === entry.foodId);
              return sum + (food ? (food.calories * entry.quantity / 100) : 0);
            }, 0);

            return (
              <Card key={meal.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{meal.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {t(`nutrition.${meal.type}`)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">{Math.round(mealCalories)} kcal</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMeal(meal.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {meal.entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
                  ) : (
                    <div className="space-y-2">
                      {meal.entries.map((entry, index) => {
                        const food = foods.find(f => f.id === entry.foodId);
                        if (!food) return null;
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Utensils className="h-4 w-4 text-muted-foreground" />
                              {food.name}
                            </span>
                            <span className="text-muted-foreground">
                              {entry.quantity}g • {Math.round(food.calories * entry.quantity / 100)} kcal
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
