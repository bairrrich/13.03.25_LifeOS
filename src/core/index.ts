/**
 * Core Module - ядро платформы LifeOS
 */

// Entity System
export {
  entityRegistry,
  getEntityConfig,
  getEntityTypes,
  hasEntity,
  type EntityConfig,
  type FieldConfig,
  type FieldType,
} from './entity';

// Database
export {
  db,
  initDatabase,
  clearDatabase,
  type LifeOSDB,
  type SyncQueueItem,
  type Device,
  type Setting,
  type TableName,
} from './database';

// CRUD Engine
export {
  createEntity,
  getEntity,
  updateEntity,
  deleteEntity,
  hardDeleteEntity,
  listEntities,
  getAllEntities,
  bulkUpdateEntities,
  bulkDeleteEntities,
  countEntities,
  type CRUDOptions,
} from './crud';

// Query Engine
export {
  query,
  executeQuery,
  aggregate,
  QueryBuilder,
  type QueryOptions,
  type QueryResult,
  type FilterObject,
  type FilterOperator,
  type SortOption,
  type AggregationOptions,
} from './query';

// Event System
export {
  eventBus,
  emit,
  on,
  once,
  off,
  type EventType,
  type LifeOSEvent,
  type EventHandler,
} from './events';

// Sync Engine
export {
  addToSyncQueue,
  getPendingChanges,
  markAsSynced,
  markAsFailed,
  incrementRetryCount,
  cleanupSyncedRecords,
  pushChanges,
  pullChanges,
  mergeEntity,
  resolveConflict,
  hasPendingChanges,
  getSyncQueueStats,
  runFullSync,
  type SyncOperation,
  type SyncConflict,
  type SyncResult,
} from './sync';
