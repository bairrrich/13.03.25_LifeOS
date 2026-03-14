'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Utensils, Flame, Trash2, Pencil, Search } from 'lucide-react';
import { Badge } from '@/ui/components/badge';
import { ProgressBar } from '@/ui/components/progress-bar';

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
  foodName: string;
  quantity: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const mockFoods: Food[] = [
  { id: '1', name: 'Овсянка', calories: 350, protein: 12, fat: 6, carbs: 60, servingSize: 100 },
  { id: '2', name: 'Куриная грудка', calories: 165, protein: 31, fat: 3.6, carbs: 0, servingSize: 100 },
  { id: '3', name: 'Рис', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, servingSize: 100 },
  { id: '4', name: 'Яйца', calories: 155, protein: 13, fat: 11, carbs: 1.1, servingSize: 100 },
  { id: '5', name: 'Банан', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, servingSize: 100 },
];

const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Завтрак',
    type: 'breakfast',
    entries: [
      { foodId: '1', foodName: 'Овсянка', quantity: 150, calories: 525, protein: 18, fat: 9, carbs: 90 },
      { foodId: '5', foodName: 'Банан', quantity: 100, calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
    ],
  },
  {
    id: '2',
    name: 'Обед',
    type: 'lunch',
    entries: [
      { foodId: '2', foodName: 'Куриная грудка', quantity: 200, calories: 330, protein: 62, fat: 7.2, carbs: 0 },
      { foodId: '3', foodName: 'Рис', quantity: 150, calories: 195, protein: 4, fat: 0.5, carbs: 42 },
    ],
  },
];

const DAILY_GOALS = {
  calories: 2500,
  protein: 150,
  fat: 80,
  carbs: 300,
};

export default function NutritionPage() {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [foods] = useState<Food[]>(mockFoods);
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Подсчёт totals
  const totalCalories = meals.reduce((sum, meal) =>
    sum + meal.entries.reduce((mSum, entry) => mSum + entry.calories, 0), 0
  );
  const totalProtein = meals.reduce((sum, meal) =>
    sum + meal.entries.reduce((mSum, entry) => mSum + entry.protein, 0), 0
  );
  const totalFat = meals.reduce((sum, meal) =>
    sum + meal.entries.reduce((mSum, entry) => mSum + entry.fat, 0), 0
  );
  const totalCarbs = meals.reduce((sum, meal) =>
    sum + meal.entries.reduce((mSum, entry) => mSum + entry.carbs, 0), 0
  );

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAddFoodToMeal = (mealId: string, food: Food, quantity: number) => {
    const multiplier = quantity / food.servingSize;
    const entry: MealEntry = {
      foodId: food.id,
      foodName: food.name,
      quantity,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
    };

    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        return { ...meal, entries: [...meal.entries, entry] };
      }
      return meal;
    }));
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const handleDeleteEntry = (mealId: string, entryIndex: number) => {
    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        return { ...meal, entries: meal.entries.filter((_, i) => i !== entryIndex) };
      }
      return meal;
    }));
  };

  const getMealTypeEmoji = (type: Meal['type']) => {
    const emojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
    return emojis[type];
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
                <div className="space-y-4">
                  <Input
                    placeholder={t('nutrition.searchFood')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredFoods.map(food => (
                      <div key={food.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {food.calories} kcal / {food.servingSize}g
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="г"
                            className="w-20 h-8"
                            defaultValue={food.servingSize}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              // В реальном приложении здесь была бы логика добавления
                              setIsFoodDialogOpen(false);
                            }}
                          >
                            {t('common.add')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <select
                    name="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="breakfast"
                  >
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

        {/* Summary Cards - Macros */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.calories')}</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalories}</div>
              <ProgressBar value={(totalCalories / DAILY_GOALS.calories) * 100} showLabel={false} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                из {DAILY_GOALS.calories} kcal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.protein')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalProtein)}g</div>
              <ProgressBar value={(totalProtein / DAILY_GOALS.protein) * 100} showLabel={false} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                из {DAILY_GOALS.protein}g
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.fat')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalFat)}g</div>
              <ProgressBar value={(totalFat / DAILY_GOALS.fat) * 100} showLabel={false} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                из {DAILY_GOALS.fat}g
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nutrition.carbs')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalCarbs)}g</div>
              <ProgressBar value={(totalCarbs / DAILY_GOALS.carbs) * 100} showLabel={false} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                из {DAILY_GOALS.carbs}g
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          {meals.map((meal) => {
            const mealCalories = meal.entries.reduce((sum, entry) => sum + entry.calories, 0);
            const mealProtein = meal.entries.reduce((sum, entry) => sum + entry.protein, 0);
            const mealFat = meal.entries.reduce((sum, entry) => sum + entry.fat, 0);
            const mealCarbs = meal.entries.reduce((sum, entry) => sum + entry.carbs, 0);

            return (
              <Card key={meal.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMealTypeEmoji(meal.type)}</span>
                      <div>
                        <CardTitle>{meal.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {t(`nutrition.${meal.type}`)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{mealCalories} kcal</p>
                        <p className="text-xs text-muted-foreground">
                          P: {Math.round(mealProtein)}g • F: {Math.round(mealFat)}g • C: {Math.round(mealCarbs)}g
                        </p>
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
                      {meal.entries.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Utensils className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{entry.foodName}</p>
                              <p className="text-xs text-muted-foreground">{entry.quantity}g</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs">
                              <p className="font-medium">{entry.calories} kcal</p>
                              <p className="text-muted-foreground">
                                P: {entry.protein}g • F: {entry.fat}g • C: {entry.carbs}g
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteEntry(meal.id, index)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
