/**
 * Mind Module Types
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Книга
 */
export interface Book extends BaseEntity {
  title: string;
  author?: string;
  pages?: number;
  current_page?: number;
  status: 'want_to_read' | 'reading' | 'completed';
  rating?: number;
  cover_url?: string;
  notes?: string;
}

/**
 * Запись чтения
 */
export interface ReadingLog extends BaseEntity {
  book_id: string;
  date: number;
  pages_read: number;
  duration?: number; // в минутах
  notes?: string;
}

/**
 * Фильм
 */
export interface Movie extends BaseEntity {
  title: string;
  year?: number;
  genre?: string;
  rating?: number;
  watched: boolean;
  watched_at?: number;
  notes?: string;
}

/**
 * Курс
 */
export interface Course extends BaseEntity {
  title: string;
  provider?: string;
  url?: string;
  progress: number; // процент
  status: 'active' | 'completed' | 'paused';
  started_at?: number;
  completed_at?: number;
  notes?: string;
}

/**
 * Заметка
 */
export interface Note extends BaseEntity {
  title: string;
  content: string;
  tags?: string[];
  parent_id?: string;
}

/**
 * Идея
 */
export interface Idea extends BaseEntity {
  title: string;
  description?: string;
  category?: string;
  status: 'captured' | 'reviewing' | 'active' | 'archived';
  tags?: string[];
}

/**
 * Статистика чтения
 */
export interface ReadingStats {
  books_read: number;
  pages_read: number;
  current_books: number;
  average_rating: number;
}
