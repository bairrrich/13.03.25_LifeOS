/**
 * Nutrition Module Services
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  query,
  aggregate,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type { Food, Meal, MealEntry, Nutrients, DailyGoals, MealType } from './types';

const USER_ID = 'default-user';

// Стандартные дневные нормы (можно кастомизировать)
const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  fat: 70,
  carbs: 250,
};

// ==================== Foods ====================

export async function createFood(
  data: Omit<Food, keyof BaseEntity>
): Promise<Food> {
  return createEntity<Food>('foods', {
    ...data,
    user_id: USER_ID,
    calories: data.calories || 0,
  });
}

export async function updateFood(
  id: string,
  data: Partial<Food>
): Promise<Food | undefined> {
  return updateEntity<Food>('foods', id, data);
}

export async function deleteFood(id: string): Promise<boolean> {
  return deleteEntity('foods', id);
}

export async function getFood(id: string): Promise<Food | undefined> {
  return getEntity<Food>('foods', id);
}

export async function getFoods(search?: string): Promise<Food[]> {
  const q = query<Food>('foods').userId(USER_ID).orderBy('name', 'asc');

  const result = await q.execute();
  let foods = result.data;

  if (search) {
    const searchLower = search.toLowerCase();
    foods = foods.filter((f) =>
      f.name.toLowerCase().includes(searchLower)
    );
  }

  return foods;
}

export async function searchFoods(queryText: string): Promise<Food[]> {
  return getFoods(queryText);
}

// ==================== Meals ====================

export async function createMeal(
  data: Omit<Meal, keyof BaseEntity>
): Promise<Meal> {
  return createEntity<Meal>('meals', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateMeal(
  id: string,
  data: Partial<Meal>
): Promise<Meal | undefined> {
  return updateEntity<Meal>('meals', id, data);
}

export async function deleteMeal(id: string): Promise<boolean> {
  return deleteEntity('meals', id);
}

export async function getMeal(id: string): Promise<Meal | undefined> {
  return getEntity<Meal>('meals', id);
}

export async function getMeals(
  date: number,
  type?: MealType
): Promise<Meal[]> {
  let q = query<Meal>('meals')
    .userId(USER_ID)
    .where('date', 'eq', date)
    .orderBy('type', 'asc');

  if (type) {
    q = q.where('type', 'eq', type);
  }

  const result = await q.execute();
  return result.data;
}

export async function getMealsByDate(date: number): Promise<Meal[]> {
  return getMeals(date);
}

// ==================== Meal Entries ====================

export async function createMealEntry(
  data: Omit<MealEntry, keyof BaseEntity>
): Promise<MealEntry> {
  return createEntity<MealEntry>('meal_entries', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateMealEntry(
  id: string,
  data: Partial<MealEntry>
): Promise<MealEntry | undefined> {
  return updateEntity<MealEntry>('meal_entries', id, data);
}

export async function deleteMealEntry(id: string): Promise<boolean> {
  return deleteEntity('meal_entries', id);
}

export async function getMealEntry(id: string): Promise<MealEntry | undefined> {
  return getEntity<MealEntry>('meal_entries', id);
}

export async function getMealEntries(mealId: string): Promise<MealEntry[]> {
  const result = await query<MealEntry>('meal_entries')
    .userId(USER_ID)
    .where('meal_id', 'eq', mealId)
    .execute();

  return result.data;
}

// ==================== Nutrient Calculations ====================

/**
 * Рассчитать нутриенты для food с учётом количества
 */
export function calculateFoodNutrients(
  food: Food,
  quantity: number,
  unit: string = 'g'
): Nutrients {
  const servingSize = food.serving_size || 100;
  const multiplier = unit === 'g' ? quantity / servingSize : quantity;

  return {
    calories: Math.round((food.calories || 0) * multiplier),
    protein: Math.round((food.protein || 0) * multiplier * 10) / 10,
    fat: Math.round((food.fat || 0) * multiplier * 10) / 10,
    carbs: Math.round((food.carbs || 0) * multiplier * 10) / 10,
    fiber: food.fiber ? Math.round(food.fiber * multiplier * 10) / 10 : undefined,
    sugar: food.sugar ? Math.round(food.sugar * multiplier * 10) / 10 : undefined,
  };
}

/**
 * Рассчитать общие нутриенты приёма пищи
 */
export async function calculateMealNutrients(mealId: string): Promise<Nutrients> {
  const entries = await getMealEntries(mealId);

  const total: Nutrients = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  for (const entry of entries) {
    const food = await getFood(entry.food_id);
    if (food) {
      const nutrients = calculateFoodNutrients(
        food,
        entry.quantity,
        entry.unit || 'g'
      );
      total.calories += nutrients.calories;
      total.protein += nutrients.protein;
      total.fat += nutrients.fat;
      total.carbs += nutrients.carbs;
    }
  }

  return total;
}

/**
 * Рассчитать дневные нутриенты
 */
export async function calculateDailyNutrients(
  date: number
): Promise<Nutrients> {
  const meals = await getMeals(date);

  const total: Nutrients = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  for (const meal of meals) {
    const mealNutrients = await calculateMealNutrients(meal.id);
    total.calories += mealNutrients.calories;
    total.protein += mealNutrients.protein;
    total.fat += mealNutrients.fat;
    total.carbs += mealNutrients.carbs;
  }

  return total;
}

/**
 * Получить остаток до цели
 */
export async function getDailyRemaining(
  date: number,
  goals: DailyGoals = DEFAULT_GOALS
): Promise<Nutrients> {
  const consumed = await calculateDailyNutrients(date);

  return {
    calories: goals.calories - consumed.calories,
    protein: goals.protein - consumed.protein,
    fat: goals.fat - consumed.fat,
    carbs: goals.carbs - consumed.carbs,
  };
}

/**
 * Получить процент выполнения цели
 */
export function getGoalProgress(
  consumed: number,
  goal: number
): number {
  if (goal === 0) return 0;
  return Math.round((consumed / goal) * 100);
}

// ==================== Quick Helpers ====================

export async function getTodayNutrients(): Promise<Nutrients> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return calculateDailyNutrients(today.getTime());
}

export async function getTodayRemaining(): Promise<Nutrients> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return getDailyRemaining(today.getTime());
}

export function getDefaultGoals(): DailyGoals {
  return DEFAULT_GOALS;
}

export async function setDailyGoals(goals: DailyGoals): Promise<void> {
  // В реальной реализации сохраняем в settings
  console.log('Setting goals:', goals);
}
