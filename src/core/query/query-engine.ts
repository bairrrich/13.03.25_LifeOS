/**
 * Query Engine для универсальных запросов к данным
 * Поддерживает фильтры, сортировку, агрегацию и пагинацию
 */

import { db, type TableName } from '@/core/database';
import type { BaseEntity } from '@/shared/types';

/**
 * Операторы фильтрации
 */
export type FilterOperator =
  | 'eq'       // равно
  | 'neq'      // не равно
  | 'gt'       // больше
  | 'gte'      // больше или равно
  | 'lt'       // меньше
  | 'lte'      // меньше или равно
  | 'contains' // содержит (для строк)
  | 'startsWith' // начинается с
  | 'endsWith'   // заканчивается на
  | 'in'       // в списке
  | 'between';  // между

/**
 * Условие фильтра
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Объект фильтра (короткая запись)
 */
export type FilterObject = Record<
  string,
  | unknown
  | { eq?: unknown; neq?: unknown; gt?: unknown; gte?: unknown; lt?: unknown; lte?: unknown; contains?: unknown; in?: unknown[]; between?: [unknown, unknown] }
>;

/**
 * Опции сортировки
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Опции запроса
 */
export interface QueryOptions<T extends BaseEntity = BaseEntity> {
  /** Тип сущности (таблица) */
  entity: TableName;
  
  /** Фильтры */
  filter?: FilterObject;
  
  /** Сортировка */
  sort?: SortOption | SortOption[];
  
  /** Лимит результатов */
  limit?: number;
  
  /** Пропуск результатов (для пагинации) */
  offset?: number;
  
  /** Поля для возврата (если нужно не всё) */
  select?: (keyof T)[];
  
  /** ID пользователя (по умолчанию 'default-user') */
  user_id?: string;
  
  /** Включая удалённые */
  includeDeleted?: boolean;
}

/**
 * Результат запроса с мета-данными
 */
export interface QueryResult<T> {
  data: T[];
  total: number;
  limit?: number;
  offset?: number;
  hasMore: boolean;
}

/**
 * Класс Query Builder
 */
export class QueryBuilder<T extends BaseEntity = BaseEntity> {
  private options: QueryOptions<T>;

  constructor(entity: TableName) {
    this.options = {
      entity,
      user_id: 'default-user',
      includeDeleted: false,
    };
  }

  /**
   * Добавить фильтр
   */
  where(field: string, operator: FilterOperator | unknown, value?: unknown): this {
    if (!this.options.filter) {
      this.options.filter = {};
    }

    if (typeof operator === 'object' || typeof operator === 'string' && value !== undefined) {
      // Короткая запись: where('field', 'value') -> eq
      if (typeof operator === 'string' && value === undefined) {
        this.options.filter[field] = operator;
      } else if (value !== undefined) {
        this.options.filter[field] = { [operator as string]: value };
      }
    }

    return this;
  }

  /**
   * Добавить сортировку
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    if (!this.options.sort) {
      this.options.sort = [];
    }

    const sorts = Array.isArray(this.options.sort)
      ? this.options.sort
      : [this.options.sort];

    sorts.push({ field, direction });
    this.options.sort = sorts;

    return this;
  }

  /**
   * Установить лимит
   */
  take(limit: number): this {
    this.options.limit = limit;
    return this;
  }

  /**
   * Установить пропуск
   */
  skip(offset: number): this {
    this.options.offset = offset;
    return this;
  }

  /**
   * Выбрать поля
   */
  select(fields: (keyof T)[]): this {
    this.options.select = fields;
    return this;
  }

  /**
   * Установить user_id
   */
  userId(userId: string): this {
    this.options.user_id = userId;
    return this;
  }

  /**
   * Включить удалённые
   */
  withDeleted(): this {
    this.options.includeDeleted = true;
    return this;
  }

  /**
   * Построить опции
   */
  build(): QueryOptions<T> {
    return { ...this.options };
  }

  /**
   * Выполнить запрос
   */
  async execute(): Promise<QueryResult<T>> {
    return executeQuery<T>(this.options);
  }

  /**
   * Получить первый результат
   */
  async first(): Promise<T | null> {
    this.options.limit = 1;
    const result = await this.execute();
    return result.data[0] || null;
  }

  /**
   * Получить все результаты (без лимита)
   */
  async all(): Promise<T[]> {
    delete this.options.limit;
    const result = await this.execute();
    return result.data;
  }

  /**
   * Получить количество
   */
  async count(): Promise<number> {
    const result = await this.execute();
    return result.total;
  }
}

/**
 * Создать Query Builder
 */
export function query<T extends BaseEntity = BaseEntity>(entity: TableName): QueryBuilder<T> {
  return new QueryBuilder<T>(entity);
}

/**
 * Выполнить запрос с опциями
 */
export async function executeQuery<T extends BaseEntity = BaseEntity>(
  options: QueryOptions<T>
): Promise<QueryResult<T>> {
  const {
    entity,
    filter,
    sort,
    limit,
    offset = 0,
    select,
    user_id = 'default-user',
    includeDeleted = false,
  } = options;

  const table = db[entity] as any;

  // Базовый запрос по user_id
  let collection = table.where('user_id').equals(user_id);

  // Фильтр по deleted_at
  if (!includeDeleted) {
    collection = collection.and((item: any) => !item.deleted_at);
  }

  // Применяем фильтры
  if (filter) {
    collection = applyFilter(collection, filter);
  }

  // Получаем все результаты для подсчёта total
  let results = await collection.toArray();

  // Применяем сортировку
  if (sort) {
    results = applySort(results, sort);
  }

  // Сохраняем total до пагинации
  const total = results.length;

  // Применяем пагинацию
  if (offset) {
    results = results.slice(offset);
  }
  if (limit) {
    results = results.slice(0, limit);
  }

  // Применяем select (выбор полей)
  if (select) {
    results = results.map((item: any) => {
      const selected: any = {};
      select.forEach((field) => {
        if (field in item) {
          selected[field] = item[field];
        }
      });
      return selected;
    });
  }

  return {
    data: results as T[],
    total,
    limit,
    offset,
    hasMore: limit ? offset + results.length < total : false,
  };
}

/**
 * Применить фильтры к коллекции
 */
function applyFilter(collection: any, filter: FilterObject): any {
  const conditions: FilterCondition[] = parseFilter(filter);

  if (conditions.length === 0) {
    return collection;
  }

  return collection.and((item: any) => {
    return conditions.every((condition) => {
      const value = item[condition.field];
      return matchCondition(value, condition);
    });
  });
}

/**
 * Распарсить фильтр в условия
 */
function parseFilter(filter: FilterObject): FilterCondition[] {
  const conditions: FilterCondition[] = [];

  for (const [field, value] of Object.entries(filter)) {
    if (typeof value === 'object' && value !== null) {
      // Развёрнутая запись: { field: { gt: 5 } }
      for (const [operator, val] of Object.entries(value)) {
        conditions.push({
          field,
          operator: operator as FilterOperator,
          value: val,
        });
      }
    } else {
      // Короткая запись: { field: value } -> eq
      conditions.push({
        field,
        operator: 'eq',
        value,
      });
    }
  }

  return conditions;
}

/**
 * Проверить соответствие условию
 */
function matchCondition(value: unknown, condition: FilterCondition): boolean {
  const { operator, value: expected } = condition;

  switch (operator) {
    case 'eq':
      return value === expected;
    case 'neq':
      return value !== expected;
    case 'gt':
      return (value as number) > (expected as number);
    case 'gte':
      return (value as number) >= (expected as number);
    case 'lt':
      return (value as number) < (expected as number);
    case 'lte':
      return (value as number) <= (expected as number);
    case 'contains':
      return String(value).includes(String(expected));
    case 'startsWith':
      return String(value).startsWith(String(expected));
    case 'endsWith':
      return String(value).endsWith(String(expected));
    case 'in':
      return (expected as unknown[]).includes(value);
    case 'between':
      const [min, max] = expected as [number, number];
      return (value as number) >= min && (value as number) <= max;
    default:
      return true;
  }
}

/**
 * Применить сортировку
 */
function applySort<T>(results: T[], sort: SortOption | SortOption[]): T[] {
  const sorts = Array.isArray(sort) ? sort : [sort];

  return [...results].sort((a: any, b: any) => {
    for (const { field, direction } of sorts) {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Агрегация данных
 */
export interface AggregationOptions {
  entity: TableName;
  field: string;
  type: 'sum' | 'avg' | 'min' | 'max' | 'count';
  filter?: FilterObject;
  user_id?: string;
  groupBy?: string;
}

/**
 * Выполнить агрегацию
 */
export async function aggregate(options: AggregationOptions): Promise<number | Record<string, number>> {
  const { entity, field, type, filter, user_id = 'default-user', groupBy } = options;

  const table = db[entity] as any;
  let collection = table.where('user_id').equals(user_id);
  collection = collection.and((item: any) => !item.deleted_at);

  if (filter) {
    collection = applyFilter(collection, filter);
  }

  const results = await collection.toArray();

  if (groupBy) {
    // Группировка
    const groups: Record<string, any[]> = {};
    results.forEach((item: any) => {
      const key = item[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    const aggregated: Record<string, number> = {};
    for (const [key, items] of Object.entries(groups)) {
      aggregated[key] = calculateAggregate(items, field, type);
    }
    return aggregated;
  }

  return calculateAggregate(results, field, type);
}

/**
 * Вычислить агрегатное значение
 */
function calculateAggregate(
  items: any[],
  field: string,
  type: 'sum' | 'avg' | 'min' | 'max' | 'count'
): number {
  const values = items.map((item) => item[field]).filter((v) => v != null);

  switch (type) {
    case 'count':
      return items.length;
    case 'sum':
      return values.reduce((sum, v) => sum + v, 0);
    case 'avg':
      return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
    case 'min':
      return values.length > 0 ? Math.min(...values) : 0;
    case 'max':
      return values.length > 0 ? Math.max(...values) : 0;
    default:
      return 0;
  }
}
