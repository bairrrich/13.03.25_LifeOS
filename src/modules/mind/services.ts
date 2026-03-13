/**
 * Mind Module Services
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntity,
  query,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type {
  Book,
  ReadingLog,
  Movie,
  Course,
  Note,
  Idea,
  ReadingStats,
} from './types';

const USER_ID = 'default-user';

// ==================== Books ====================

export async function createBook(
  data: Omit<Book, keyof BaseEntity>
): Promise<Book> {
  return createEntity<Book>('books', {
    ...data,
    user_id: USER_ID,
    status: data.status || 'want_to_read',
    current_page: data.current_page || 0,
  });
}

export async function updateBook(
  id: string,
  data: Partial<Book>
): Promise<Book | undefined> {
  return updateEntity<Book>('books', id, data);
}

export async function deleteBook(id: string): Promise<boolean> {
  return deleteEntity('books', id);
}

export async function getBook(id: string): Promise<Book | undefined> {
  return getEntity<Book>('books', id);
}

export async function getBooks(status?: Book['status']): Promise<Book[]> {
  let q = query<Book>('books').userId(USER_ID).orderBy('title', 'asc');

  if (status) {
    q = q.where('status', 'eq', status);
  }

  const result = await q.execute();
  return result.data;
}

export async function updateReadingProgress(
  bookId: string,
  currentPage: number
): Promise<Book | undefined> {
  const book = await getBook(bookId);
  if (!book) return undefined;

  let status: Book['status'] = book.status;
  if (currentPage > 0 && currentPage < (book.pages || 1)) {
    status = 'reading';
  } else if (book.pages && currentPage >= book.pages) {
    status = 'completed';
  }

  return updateBook(bookId, { current_page: currentPage, status });
}

// ==================== Reading Logs ====================

export async function createReadingLog(
  data: Omit<ReadingLog, keyof BaseEntity>
): Promise<ReadingLog> {
  return createEntity<ReadingLog>('reading_logs', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateReadingLog(
  id: string,
  data: Partial<ReadingLog>
): Promise<ReadingLog | undefined> {
  return updateEntity<ReadingLog>('reading_logs', id, data);
}

export async function deleteReadingLog(id: string): Promise<boolean> {
  return deleteEntity('reading_logs', id);
}

export async function getReadingLogs(
  bookId: string,
  startDate?: number,
  endDate?: number
): Promise<ReadingLog[]> {
  let q = query<ReadingLog>('reading_logs')
    .userId(USER_ID)
    .where('book_id', 'eq', bookId)
    .orderBy('date', 'desc');

  if (startDate) {
    q = q.where('date', 'gte', startDate);
  }
  if (endDate) {
    q = q.where('date', 'lte', endDate);
  }

  const result = await q.execute();
  return result.data;
}

export async function logReadingSession(
  bookId: string,
  pagesRead: number,
  duration?: number,
  notes?: string
): Promise<ReadingLog> {
  const log = await createReadingLog({
    book_id: bookId,
    date: Date.now(),
    pages_read: pagesRead,
    duration,
    ...(notes && { notes }),
  });

  // Обновляем прогресс книги
  const book = await getBook(bookId);
  if (book) {
    await updateReadingProgress(bookId, (book.current_page || 0) + pagesRead);
  }

  return log;
}

// ==================== Movies ====================

export async function createMovie(
  data: Omit<Movie, keyof BaseEntity>
): Promise<Movie> {
  return createEntity<Movie>('movies', {
    ...data,
    user_id: USER_ID,
    watched: data.watched ?? false,
  });
}

export async function updateMovie(
  id: string,
  data: Partial<Movie>
): Promise<Movie | undefined> {
  return updateEntity<Movie>('movies', id, data);
}

export async function deleteMovie(id: string): Promise<boolean> {
  return deleteEntity('movies', id);
}

export async function getMovie(id: string): Promise<Movie | undefined> {
  return getEntity<Movie>('movies', id);
}

export async function getMovies(watched?: boolean): Promise<Movie[]> {
  let q = query<Movie>('movies').userId(USER_ID).orderBy('title', 'asc');

  if (watched !== undefined) {
    q = q.where('watched', 'eq', watched);
  }

  const result = await q.execute();
  return result.data;
}

export async function markMovieWatched(
  id: string
): Promise<Movie | undefined> {
  return updateMovie(id, {
    watched: true,
    watched_at: Date.now(),
  });
}

// ==================== Courses ====================

export async function createCourse(
  data: Omit<Course, keyof BaseEntity>
): Promise<Course> {
  return createEntity<Course>('courses', {
    ...data,
    user_id: USER_ID,
    progress: data.progress || 0,
    status: data.status || 'active',
  });
}

export async function updateCourse(
  id: string,
  data: Partial<Course>
): Promise<Course | undefined> {
  return updateEntity<Course>('courses', id, data);
}

export async function deleteCourse(id: string): Promise<boolean> {
  return deleteEntity('courses', id);
}

export async function getCourse(id: string): Promise<Course | undefined> {
  return getEntity<Course>('courses', id);
}

export async function getCourses(status?: Course['status']): Promise<Course[]> {
  let q = query<Course>('courses').userId(USER_ID).orderBy('title', 'asc');

  if (status) {
    q = q.where('status', 'eq', status);
  }

  const result = await q.execute();
  return result.data;
}

export async function updateCourseProgress(
  courseId: string,
  progress: number
): Promise<Course | undefined> {
  let status: Course['status'] = 'active';
  if (progress >= 100) {
    status = 'completed';
  }

  return updateCourse(courseId, {
    progress: Math.min(progress, 100),
    status,
    completed_at: progress >= 100 ? Date.now() : undefined,
  });
}

// ==================== Notes ====================

export async function createNote(
  data: Omit<Note, keyof BaseEntity>
): Promise<Note> {
  return createEntity<Note>('notes', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateNote(
  id: string,
  data: Partial<Note>
): Promise<Note | undefined> {
  return updateEntity<Note>('notes', id, data);
}

export async function deleteNote(id: string): Promise<boolean> {
  return deleteEntity('notes', id);
}

export async function getNote(id: string): Promise<Note | undefined> {
  return getEntity<Note>('notes', id);
}

export async function getNotes(): Promise<Note[]> {
  const result = await query<Note>('notes')
    .userId(USER_ID)
    .orderBy('created_at', 'desc')
    .execute();

  return result.data;
}

// ==================== Ideas ====================

export async function createIdea(
  data: Omit<Idea, keyof BaseEntity>
): Promise<Idea> {
  return createEntity<Idea>('ideas', {
    ...data,
    user_id: USER_ID,
    status: data.status || 'captured',
  });
}

export async function updateIdea(
  id: string,
  data: Partial<Idea>
): Promise<Idea | undefined> {
  return updateEntity<Idea>('ideas', id, data);
}

export async function deleteIdea(id: string): Promise<boolean> {
  return deleteEntity('ideas', id);
}

export async function getIdea(id: string): Promise<Idea | undefined> {
  return getEntity<Idea>('ideas', id);
}

export async function getIdeas(status?: Idea['status']): Promise<Idea[]> {
  let q = query<Idea>('ideas').userId(USER_ID).orderBy('created_at', 'desc');

  if (status) {
    q = q.where('status', 'eq', status);
  }

  const result = await q.execute();
  return result.data;
}

// ==================== Statistics ====================

export async function getReadingStats(): Promise<ReadingStats> {
  const books = await query<Book>('books').userId(USER_ID).execute();

  const completed = books.data.filter((b) => b.status === 'completed');
  const reading = books.data.filter((b) => b.status === 'reading');

  const totalPages = completed.reduce((sum, b) => sum + (b.pages || 0), 0);
  const ratings = completed.filter((b) => b.rating).map((b) => b.rating!);
  const avgRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  return {
    books_read: completed.length,
    pages_read: totalPages,
    current_books: reading.length,
    average_rating: Math.round(avgRating * 10) / 10,
  };
}
