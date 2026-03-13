/**
 * Универсальный CRUD Engine для всех сущностей
 * Работает с любой таблицей через entity type
 */

import { db, type TableName } from '@/core/database';
import type { BaseEntity, SyncStatus } from '@/shared/types';
import { generateId } from '@/shared/lib/generate-id';
import { eventBus } from '@/core/events';

/**
 * Внутренняя функция для отправки событий (без типизации для универсальности)
 */
function emitEvent(event: string, payload: unknown) {
  eventBus.emit(event as any, payload).catch(console.error);
}

/**
 * Опции для CRUD операций
 */
export interface CRUDOptions {
  user_id?: string;
  skipSync?: boolean;
}

/**
 * Создать новую сущность
 */
export async function createEntity<T extends BaseEntity>(
  entityType: TableName,
  data: Partial<T>,
  options: CRUDOptions = {}
): Promise<T> {
  const { user_id = 'default-user', skipSync = false } = options;

  const now = Date.now();
  const entity = {
    ...data,
    id: data.id || generateId(),
    user_id: data.user_id || user_id,
    created_at: data.created_at || now,
    updated_at: data.updated_at || now,
    version: data.version || 1,
    sync_status: (skipSync ? 'synced' : 'local') as SyncStatus,
  } as T;

  const table = db[entityType];
  await table.add(entity as any);

  // Emit событие создания
  emitEvent(`${entityType}.created`, entity);

  return entity;
}

/**
 * Получить сущность по ID
 */
export async function getEntity<T extends BaseEntity>(
  entityType: TableName,
  id: string
): Promise<T | undefined> {
  const table = db[entityType];
  const entity = await table.get(id);

  // Проверка на soft delete
  if (entity && 'deleted_at' in entity && entity.deleted_at) {
    return undefined;
  }

  return entity as T | undefined;
}

/**
 * Обновить сущность
 */
export async function updateEntity<T extends BaseEntity>(
  entityType: TableName,
  id: string,
  updates: Partial<T>,
  options: CRUDOptions = {}
): Promise<T | undefined> {
  const { skipSync = false } = options;

  const table = db[entityType];
  const existing = await table.get(id);

  if (!existing || ('deleted_at' in existing && existing.deleted_at)) {
    return undefined;
  }

  const now = Date.now();
  const updated = {
    ...existing,
    ...updates,
    id, // Защита от изменения ID
    updated_at: now,
    version: ((existing as any).version || 0) + 1,
    sync_status: skipSync ? 'synced' : ('local' as SyncStatus),
  } as unknown as T;

  await table.put(updated as any);

  // Emit событие обновления
  emitEvent(`${entityType}.updated`, updated);

  return updated;
}

/**
 * Мягкое удаление сущности (soft delete)
 */
export async function deleteEntity(
  entityType: TableName,
  id: string,
  options: CRUDOptions = {}
): Promise<boolean> {
  const { skipSync = false } = options;

  const table = db[entityType];
  const existing = await table.get(id);

  if (!existing || ('deleted_at' in existing && existing.deleted_at)) {
    return false;
  }

  const now = Date.now();
  const deleted = {
    ...existing,
    deleted_at: now,
    updated_at: now,
    version: ((existing as any).version || 0) + 1,
    sync_status: skipSync ? 'synced' : ('local' as SyncStatus),
  };

  await table.put(deleted as any);

  // Emit событие удаления
  emitEvent(`${entityType}.deleted`, { id, entityType });

  return true;
}

/**
 * Физическое удаление сущности (использовать осторожно!)
 */
export async function hardDeleteEntity(
  entityType: TableName,
  id: string
): Promise<boolean> {
  const table = db[entityType];
  await table.delete(id);

  emitEvent(`${entityType}.hardDeleted`, { id, entityType });

  return true;
}

/**
 * Получить список сущностей с фильтрацией
 */
export async function listEntities<T extends BaseEntity>(
  entityType: TableName,
  options: {
    user_id?: string;
    includeDeleted?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<T[]> {
  const {
    user_id = 'default-user',
    includeDeleted = false,
    limit,
    offset,
  } = options;

  const table = db[entityType];
  let query = table.where('user_id').equals(user_id);

  if (!includeDeleted) {
    query = query.and((entity: any) => !('deleted_at' in entity) || !entity.deleted_at);
  }

  let results = await query.toArray();

  // Применяем offset и limit
  if (offset) {
    results = results.slice(offset);
  }
  if (limit) {
    results = results.slice(0, limit);
  }

  return results as unknown as T[];
}

/**
 * Получить все сущности типа (без фильтрации по user_id)
 */
export async function getAllEntities<T extends BaseEntity>(
  entityType: TableName,
  includeDeleted = false
): Promise<T[]> {
  const table = db[entityType];
  let results = await table.toArray() as any[];

  if (!includeDeleted) {
    results = results.filter((e) => !('deleted_at' in e) || !e.deleted_at);
  }

  return results as unknown as T[];
}

/**
 * Массовое обновление сущностей
 */
export async function bulkUpdateEntities<T extends BaseEntity>(
  entityType: TableName,
  ids: string[],
  updates: Partial<T>
): Promise<number> {
  const table = db[entityType] as any;
  const now = Date.now();

  let updatedCount = 0;

  await table
    .where('id')
    .anyOf(ids)
    .modify((entity: any) => {
      if (!('deleted_at' in entity) || !entity.deleted_at) {
        Object.assign(entity, updates, {
          updated_at: now,
          version: (entity.version || 0) + 1,
          sync_status: 'local',
        });
        updatedCount++;
      }
    });

  emitEvent(`${entityType}.bulkUpdated`, { ids, updates });

  return updatedCount;
}

/**
 * Массовое удаление сущностей
 */
export async function bulkDeleteEntities(
  entityType: TableName,
  ids: string[]
): Promise<number> {
  const table = db[entityType] as any;
  const now = Date.now();

  let deletedCount = 0;

  await table
    .where('id')
    .anyOf(ids)
    .modify((entity: any) => {
      if (!('deleted_at' in entity) || !entity.deleted_at) {
        Object.assign(entity, {
          deleted_at: now,
          updated_at: now,
          version: (entity.version || 0) + 1,
          sync_status: 'local',
        });
        deletedCount++;
      }
    });

  emitEvent(`${entityType}.bulkDeleted`, { ids });

  return deletedCount;
}

/**
 * Получить количество сущностей
 */
export async function countEntities(
  entityType: TableName,
  user_id = 'default-user',
  includeDeleted = false
): Promise<number> {
  const table = db[entityType];
  let query = table.where('user_id').equals(user_id);

  if (!includeDeleted) {
    query = query.and((entity: any) => !('deleted_at' in entity) || !entity.deleted_at);
  }

  return query.count();
}
