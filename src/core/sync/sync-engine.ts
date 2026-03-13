/**
 * Sync Engine для offline-first синхронизации
 * Управляет очередью изменений, push/pull и разрешением конфликтов
 */

import { db } from '@/core/database';
import type { SyncQueueItem } from '@/core/database/types';
import type { BaseEntity, SyncStatus } from '@/shared/types';
import { emit } from '@/core/events';

/**
 * Статусы синхронизации
 */
export type SyncOperation = 'create' | 'update' | 'delete';

/**
 * Конфликт синхронизации
 */
export interface SyncConflict {
  entityType: string;
  entityId: string;
  localVersion: BaseEntity;
  serverVersion: BaseEntity;
  resolved?: BaseEntity;
}

/**
 * Результат синхронизации
 */
export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  conflicts: SyncConflict[];
  errors: string[];
}

/**
 * Добавить изменение в очередь синхронизации
 */
export async function addToSyncQueue(
  entityType: string,
  entityId: string,
  operation: SyncOperation,
  payload: Record<string, unknown>
): Promise<void> {
  const queueItem: Omit<SyncQueueItem, 'id'> = {
    entity_type: entityType,
    entity_id: entityId,
    operation,
    payload,
    created_at: Date.now(),
    status: 'pending',
    retry_count: 0,
  };

  await db.sync_queue.add(queueItem as SyncQueueItem);
}

/**
 * Получить.pending изменения из очереди
 */
export async function getPendingChanges(limit = 50): Promise<SyncQueueItem[]> {
  return await db.sync_queue
    .where('status')
    .equals('pending')
    .sortBy('created_at')
    .then((items) => items.slice(0, limit));
}

/**
 * Отметить изменения как синхронизированные
 */
export async function markAsSynced(ids: number[]): Promise<void> {
  await db.sync_queue.bulkPut(
    ids.map((id) => ({
      id,
      status: 'synced',
      error: undefined,
    })) as any
  );
}

/**
 * Отметить изменения как ошибочные
 */
export async function markAsFailed(ids: number[], error: string): Promise<void> {
  for (const id of ids) {
    const item = await db.sync_queue.get(id);
    if (item) {
      await db.sync_queue.update(id, {
        status: 'failed',
        error,
      });
    }
  }
}

/**
 * Увеличить счётчик попыток
 */
export async function incrementRetryCount(ids: number[]): Promise<void> {
  for (const id of ids) {
    const item = await db.sync_queue.get(id);
    if (item) {
      await db.sync_queue.update(id, {
        retry_count: (item.retry_count || 0) + 1,
        status: 'pending' as const,
      });
    }
  }
}

/**
 * Очистить старые синхронизированные записи
 */
export async function cleanupSyncedRecords(maxAgeDays = 7): Promise<number> {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const items = await db.sync_queue
    .where('status')
    .equals('synced')
    .and((item) => item.created_at < cutoff)
    .toArray();

  if (items.length > 0) {
    await db.sync_queue.bulkDelete(items.map((i) => i.id!) as number[]);
  }

  return items.length;
}

/**
 * Выполнить push изменений на сервер
 */
export async function pushChanges(
  changes: SyncQueueItem[],
  pushFn: (changes: SyncQueueItem[]) => Promise<{ success: boolean; data?: any }>
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    conflicts: [],
    errors: [],
  };

  if (changes.length === 0) {
    return result;
  }

  emit('sync.started', { type: 'push', count: changes.length });

  try {
    // Отправляем изменения на сервер
    const response = await pushFn(changes);

    if (response.success) {
      // Успешная синхронизация
      const syncedIds = changes.map((c) => c.id!) as number[];
      await markAsSynced(syncedIds);
      result.synced = changes.length;
    } else {
      // Ошибка на сервере
      const failedIds = changes.map((c) => c.id!) as number[];
      await markAsFailed(failedIds, 'Server error');
      result.failed = changes.length;
      result.errors.push('Server returned error');
      result.success = false;
    }
  } catch (error) {
    // Сетевая ошибка или другая
    const failedIds = changes.map((c) => c.id!) as number[];
    await incrementRetryCount(failedIds);
    result.failed = changes.length;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    result.success = false;
  }

  emit('sync.completed', { type: 'push', result });

  return result;
}

/**
 * Выполнить pull изменений с сервера
 */
export async function pullChanges(
  pullFn: (since: number) => Promise<{ changes: BaseEntity[]; timestamp: number }>,
  mergeFn: (local: BaseEntity, server: BaseEntity) => BaseEntity
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    conflicts: [],
    errors: [],
  };

  emit('sync.started', { type: 'pull' });

  try {
    // Получаем last_sync timestamp
    const lastSync = await getLastSyncTimestamp();

    // Запрашиваем изменения с сервера
    const { changes, timestamp } = await pullFn(lastSync);

    // Применяем изменения локально
    for (const serverEntity of changes) {
      try {
        await mergeEntity(serverEntity, mergeFn);
        result.synced++;
      } catch (error) {
        result.failed++;
        result.errors.push(error instanceof Error ? error.message : 'Merge error');
      }
    }

    // Обновляем last_sync timestamp
    await updateLastSyncTimestamp(timestamp);

    emit('sync.completed', { type: 'pull', result });
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Pull error');
    emit('sync.error', { type: 'pull', error });
  }

  return result;
}

/**
 * Слить локальную и серверную версии сущности
 */
export async function mergeEntity(
  serverEntity: BaseEntity,
  mergeFn: (local: BaseEntity, server: BaseEntity) => BaseEntity
): Promise<void> {
  const entityType = getEntityTypeFromEntity(serverEntity);
  if (!entityType) {
    throw new Error('Cannot determine entity type');
  }

  const table = (db as any)[entityType + 's'];
  if (!table) {
    throw new Error(`Table ${entityType}s not found`);
  }

  const localEntity = await table.get(serverEntity.id);

  if (!localEntity) {
    // Локальной версии нет, создаём
    await table.add(serverEntity);
    return;
  }

  // Проверяем конфликт версий
  if (localEntity.version >= serverEntity.version) {
    // Локальная версия новее или такая же
    if (localEntity.sync_status === 'synced') {
      // Уже синхронизировано, ничего не делаем
      return;
    }
    // Локальные изменения, оставляем локальную
    return;
  }

  // Серверная версия новее, применяем merge
  const merged = mergeFn(localEntity, serverEntity);
  await table.put(merged);
}

/**
 * Разрешить конфликт синхронизации
 */
export async function resolveConflict(
  conflict: SyncConflict,
  strategy: 'local' | 'server' | 'merge'
): Promise<BaseEntity | null> {
  const entityType = conflict.entityType;
  const table = (db as any)[entityType + 's'];

  if (!table) {
    throw new Error(`Table ${entityType}s not found`);
  }

  let resolved: BaseEntity;

  switch (strategy) {
    case 'local':
      resolved = conflict.localVersion;
      break;
    case 'server':
      resolved = conflict.serverVersion;
      break;
    case 'merge':
      // Простой merge: берём server для всех полей кроме metadata
      resolved = {
        ...conflict.serverVersion,
        metadata: {
          ...conflict.serverVersion.metadata,
          ...conflict.localVersion.metadata,
        },
      };
      break;
  }

  // Обновляем локальную запись
  await table.put(resolved);

  // Обновляем sync_status
  resolved.sync_status = 'synced';
  resolved.version = Math.max(
    conflict.localVersion.version,
    conflict.serverVersion.version
  ) + 1;

  return resolved;
}

/**
 * Получить timestamp последней синхронизации
 */
async function getLastSyncTimestamp(): Promise<number> {
  const setting = await db.settings.get('last_sync_timestamp');
  return setting ? (setting.value as number) : 0;
}

/**
 * Обновить timestamp последней синхронизации
 */
async function updateLastSyncTimestamp(timestamp: number): Promise<void> {
  await db.settings.put({
    key: 'last_sync_timestamp',
    value: timestamp,
    updated_at: Date.now(),
  });
}

/**
 * Проверить, есть ли pending изменения
 */
export async function hasPendingChanges(): Promise<boolean> {
  const count = await db.sync_queue.where('status').equals('pending').count();
  return count > 0;
}

/**
 * Получить статистику очереди
 */
export async function getSyncQueueStats(): Promise<{
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
}> {
  const pending = await db.sync_queue.where('status').equals('pending').count();
  const syncing = await db.sync_queue.where('status').equals('syncing').count();
  const synced = await db.sync_queue.where('status').equals('synced').count();
  const failed = await db.sync_queue.where('status').equals('failed').count();

  return { pending, syncing, synced, failed };
}

/**
 * Определить тип сущности из объекта
 */
function getEntityTypeFromEntity(entity: BaseEntity): string | null {
  // Пытаемся определить по таблице (для этого нужен обратный маппинг)
  // В простой версии можно хранить type в metadata
  if (entity.metadata?.entityType) {
    return entity.metadata.entityType as string;
  }
  return null;
}

/**
 * Полная синхронизация (push + pull)
 */
export async function runFullSync(
  pushFn: (changes: SyncQueueItem[]) => Promise<{ success: boolean }>,
  pullFn: (since: number) => Promise<{ changes: BaseEntity[]; timestamp: number }>,
  mergeFn: (local: BaseEntity, server: BaseEntity) => BaseEntity
): Promise<{ push: SyncResult; pull: SyncResult }> {
  // Сначала push локальных изменений
  const pendingChanges = await getPendingChanges();
  const pushResult = await pushChanges(pendingChanges, pushFn);

  // Затем pull серверных изменений
  const pullResult = await pullChanges(pullFn, mergeFn);

  return { push: pushResult, pull: pullResult };
}
