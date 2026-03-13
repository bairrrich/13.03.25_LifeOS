import { z } from 'zod';

/**
 * Типы полей сущности
 */
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'json' | 'enum';

/**
 * Конфигурация поля сущности
 */
export interface FieldConfig {
  type: FieldType;
  required?: boolean;
  default?: unknown;
  enum?: string[];
  validate?: z.ZodType;
}

/**
 * Конфигурация сущности
 */
export interface EntityConfig {
  /** Имя таблицы в БД */
  table: string;
  
  /** Описание сущности */
  label: string;
  
  /** Поля сущности */
  fields: Record<string, FieldConfig>;
  
  /** Индексы для поиска */
  indexes?: string[];
  
  /** Связи с другими сущностями */
  relations?: {
    [key: string]: {
      entity: string;
      field: string;
      type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
    };
  };
}

/**
 * Глобальный реестр всех сущностей системы
 */
export const entityRegistry: Record<string, EntityConfig> = {
  // Finance Module
  transaction: {
    table: 'transactions',
    label: 'Транзакция',
    fields: {
      account_id: { type: 'string', required: true },
      category_id: { type: 'string', required: true },
      amount: { type: 'number', required: true },
      currency: { type: 'string', required: true, default: 'EUR' },
      type: { 
        type: 'enum', 
        required: true, 
        enum: ['expense', 'income', 'transfer'],
        default: 'expense'
      },
      date: { type: 'date', required: true },
      description: { type: 'string', required: false },
    },
    indexes: ['account_id', 'category_id', 'date', 'type'],
    relations: {
      account: { entity: 'account', field: 'account_id', type: 'many-to-one' },
      category: { entity: 'category', field: 'category_id', type: 'many-to-one' },
    },
  },

  account: {
    table: 'accounts',
    label: 'Счёт',
    fields: {
      name: { type: 'string', required: true },
      type: { 
        type: 'enum', 
        required: true, 
        enum: ['cash', 'bank', 'card', 'investment'],
        default: 'cash'
      },
      currency: { type: 'string', required: true, default: 'EUR' },
      balance: { type: 'number', required: true, default: 0 },
      icon: { type: 'string', required: false },
      color: { type: 'string', required: false },
    },
    indexes: ['type'],
  },

  category: {
    table: 'categories',
    label: 'Категория',
    fields: {
      name: { type: 'string', required: true },
      type: { 
        type: 'enum', 
        required: true, 
        enum: ['income', 'expense'],
      },
      parent_id: { type: 'string', required: false },
      icon: { type: 'string', required: false },
      color: { type: 'string', required: false },
    },
    indexes: ['type', 'parent_id'],
  },

  budget: {
    table: 'budgets',
    label: 'Бюджет',
    fields: {
      name: { type: 'string', required: true },
      category_id: { type: 'string', required: true },
      amount: { type: 'number', required: true },
      period: { 
        type: 'enum', 
        required: true, 
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly'
      },
      start_date: { type: 'date', required: true },
      end_date: { type: 'date', required: false },
    },
    indexes: ['category_id', 'period'],
  },

  // Habits Module
  habit: {
    table: 'habits',
    label: 'Привычка',
    fields: {
      name: { type: 'string', required: true },
      frequency: { 
        type: 'enum', 
        required: true, 
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
      },
      target: { type: 'number', required: true, default: 1 },
      color: { type: 'string', required: false },
      icon: { type: 'string', required: false },
      description: { type: 'string', required: false },
    },
    indexes: ['frequency'],
  },

  habit_log: {
    table: 'habit_logs',
    label: 'Запись привычки',
    fields: {
      habit_id: { type: 'string', required: true },
      date: { type: 'date', required: true },
      completed: { type: 'boolean', required: true, default: false },
      value: { type: 'number', required: false },
      note: { type: 'string', required: false },
    },
    indexes: ['habit_id', 'date'],
    relations: {
      habit: { entity: 'habit', field: 'habit_id', type: 'many-to-one' },
    },
  },

  // Nutrition Module
  food: {
    table: 'foods',
    label: 'Продукт',
    fields: {
      name: { type: 'string', required: true },
      calories: { type: 'number', required: true, default: 0 },
      protein: { type: 'number', required: false, default: 0 },
      fat: { type: 'number', required: false, default: 0 },
      carbs: { type: 'number', required: false, default: 0 },
      fiber: { type: 'number', required: false, default: 0 },
      sugar: { type: 'number', required: false, default: 0 },
      brand: { type: 'string', required: false },
      serving_size: { type: 'number', required: false, default: 100 },
      serving_unit: { type: 'string', required: false, default: 'g' },
    },
    indexes: ['name'],
  },

  meal: {
    table: 'meals',
    label: 'Приём пищи',
    fields: {
      name: { type: 'string', required: true },
      date: { type: 'date', required: true },
      type: { 
        type: 'enum', 
        required: true, 
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      },
    },
    indexes: ['date', 'type'],
  },

  meal_entry: {
    table: 'meal_entries',
    label: 'Запись приёма пищи',
    fields: {
      meal_id: { type: 'string', required: true },
      food_id: { type: 'string', required: true },
      quantity: { type: 'number', required: true },
      unit: { type: 'string', required: false, default: 'g' },
    },
    indexes: ['meal_id', 'food_id'],
    relations: {
      meal: { entity: 'meal', field: 'meal_id', type: 'many-to-one' },
      food: { entity: 'food', field: 'food_id', type: 'many-to-one' },
    },
  },

  // Workouts Module
  exercise: {
    table: 'exercises',
    label: 'Упражнение',
    fields: {
      name: { type: 'string', required: true },
      muscle_group: { type: 'string', required: false },
      equipment: { type: 'string', required: false },
      difficulty: { 
        type: 'enum', 
        required: false, 
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      },
      instructions: { type: 'string', required: false },
    },
    indexes: ['muscle_group', 'difficulty'],
  },

  workout: {
    table: 'workouts',
    label: 'Тренировка',
    fields: {
      name: { type: 'string', required: true },
      date: { type: 'date', required: true },
      duration: { type: 'number', required: false },
      type: { type: 'string', required: false },
      notes: { type: 'string', required: false },
    },
    indexes: ['date'],
  },

  set: {
    table: 'sets',
    label: 'Подход',
    fields: {
      workout_id: { type: 'string', required: true },
      exercise_id: { type: 'string', required: true },
      reps: { type: 'number', required: false },
      weight: { type: 'number', required: false, default: 0 },
      duration: { type: 'number', required: false },
      distance: { type: 'number', required: false },
      order: { type: 'number', required: true, default: 0 },
    },
    indexes: ['workout_id', 'exercise_id'],
    relations: {
      workout: { entity: 'workout', field: 'workout_id', type: 'many-to-one' },
      exercise: { entity: 'exercise', field: 'exercise_id', type: 'many-to-one' },
    },
  },

  // Health Module
  sleep_log: {
    table: 'sleep_logs',
    label: 'Сон',
    fields: {
      date: { type: 'date', required: true },
      start_time: { type: 'date', required: true },
      end_time: { type: 'date', required: true },
      quality: { 
        type: 'enum', 
        required: false, 
        enum: ['poor', 'fair', 'good', 'excellent'],
      },
      notes: { type: 'string', required: false },
    },
    indexes: ['date'],
  },

  weight_log: {
    table: 'weight_logs',
    label: 'Вес',
    fields: {
      date: { type: 'date', required: true },
      weight: { type: 'number', required: true },
      body_fat: { type: 'number', required: false },
      notes: { type: 'string', required: false },
    },
    indexes: ['date'],
  },

  // Goals Module
  goal: {
    table: 'goals',
    label: 'Цель',
    fields: {
      name: { type: 'string', required: true },
      type: { 
        type: 'enum', 
        required: true, 
        enum: ['finance', 'health', 'learning', 'personal'],
      },
      target_value: { type: 'number', required: false },
      current_value: { type: 'number', required: false, default: 0 },
      deadline: { type: 'date', required: false },
      description: { type: 'string', required: false },
      status: { 
        type: 'enum', 
        required: true, 
        enum: ['active', 'completed', 'paused', 'abandoned'],
        default: 'active'
      },
    },
    indexes: ['type', 'status'],
  },

  // Mind Module
  book: {
    table: 'books',
    label: 'Книга',
    fields: {
      title: { type: 'string', required: true },
      author: { type: 'string', required: false },
      pages: { type: 'number', required: false },
      current_page: { type: 'number', required: false, default: 0 },
      status: { 
        type: 'enum', 
        required: true, 
        enum: ['want_to_read', 'reading', 'completed'],
        default: 'want_to_read'
      },
      rating: { type: 'number', required: false },
    },
    indexes: ['status', 'author'],
  },

  // Beauty Module
  cosmetic: {
    table: 'cosmetics',
    label: 'Косметика',
    fields: {
      name: { type: 'string', required: true },
      brand: { type: 'string', required: false },
      category: { type: 'string', required: true },
      expiration_date: { type: 'date', required: false },
      opened_at: { type: 'date', required: false },
      notes: { type: 'string', required: false },
    },
    indexes: ['category', 'expiration_date'],
  },
};

/**
 * Получить конфигурацию сущности по имени
 */
export function getEntityConfig(entityType: string): EntityConfig | undefined {
  return entityRegistry[entityType];
}

/**
 * Получить все типы сущностей
 */
export function getEntityTypes(): string[] {
  return Object.keys(entityRegistry);
}

/**
 * Проверить существование сущности
 */
export function hasEntity(entityType: string): boolean {
  return entityType in entityRegistry;
}
