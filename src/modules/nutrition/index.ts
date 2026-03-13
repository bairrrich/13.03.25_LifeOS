export type {
  Food,
  Meal,
  MealEntry,
  Nutrients,
  DailyGoals,
  MealType,
} from './types';

export {
  // Foods
  createFood,
  updateFood,
  deleteFood,
  getFood,
  getFoods,
  searchFoods,

  // Meals
  createMeal,
  updateMeal,
  deleteMeal,
  getMeal,
  getMeals,
  getMealsByDate,

  // Meal Entries
  createMealEntry,
  updateMealEntry,
  deleteMealEntry,
  getMealEntry,
  getMealEntries,

  // Calculations
  calculateFoodNutrients,
  calculateMealNutrients,
  calculateDailyNutrients,
  getDailyRemaining,
  getGoalProgress,

  // Helpers
  getTodayNutrients,
  getTodayRemaining,
  getDefaultGoals,
  setDailyGoals,
} from './services';

export {
  useFoods,
  useMeals,
  useMealEntries,
  useDailyNutrients,
  useDailyRemaining,
  useMealNutrients,
  useTodayNutrients,
  useTodayRemaining,
  useFoodSearch,
} from './hooks';
