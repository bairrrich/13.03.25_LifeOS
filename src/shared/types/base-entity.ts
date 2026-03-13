/**
 * Базовая сущность для всех объектов в системе
 * Наследуется всеми модулями (финансы, питание, тренировки и т.д.)
 */

export type SyncStatus = 'local' | 'synced' | 'conflict';

export interface BaseEntity {
  /** Уникальный идентификатор (ulid/cuid2) */
  id: string;

  /** ID владельца */
  user_id: string;

  /** Дата создания (timestamp) */
  created_at: number;

  /** Дата последнего изменения (timestamp) */
  updated_at: number;

  /** Дата мягкого удаления (опционально) */
  deleted_at?: number;

  /** Версия для синхронизации */
  version: number;

  /** Статус синхронизации */
  sync_status: SyncStatus;

  /** Дополнительные данные */
  metadata?: Record<string, unknown>;

  /** Теги для глобального поиска */
  tags?: string[];

  /** Заметки */
  notes?: string;
}
