export type { BaseEntity, SyncStatus } from '@/shared/types/base-entity';
export { generateId, isValidId, getIdTimestamp } from '@/shared/lib/generate-id';

export {
  entityRegistry,
  getEntityConfig,
  getEntityTypes,
  hasEntity,
  type EntityConfig,
  type FieldConfig,
  type FieldType,
} from './entity-registry';
