/**
 * Mind Module Hooks
 */

'use client';

import { useEffect, useState } from 'react';
import type { Book, ReadingLog, Movie, Course, Note, Idea, ReadingStats } from './types';
import * as mindService from './services';

/**
 * Hook для книг
 */
export function useBooks(status?: Book['status']) {
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getBooks(status)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [status]);

  return { data, loading, error };
}

/**
 * Hook для одной книги
 */
export function useBook(id: string) {
  const [data, setData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getBook(id)
      .then((book) => setData(book || null))
      .catch((err) => setError(err.message));
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook для записей чтения
 */
export function useReadingLogs(bookId: string) {
  const [data, setData] = useState<ReadingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getReadingLogs(bookId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [bookId]);

  return { data, loading, error };
}

/**
 * Hook для фильмов
 */
export function useMovies(watched?: boolean) {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getMovies(watched)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [watched]);

  return { data, loading, error };
}

/**
 * Hook для курсов
 */
export function useCourses(status?: Course['status']) {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getCourses(status)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [status]);

  return { data, loading, error };
}

/**
 * Hook для заметок
 */
export function useNotes() {
  const [data, setData] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getNotes()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}

/**
 * Hook для идей
 */
export function useIdeas(status?: Idea['status']) {
  const [data, setData] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getIdeas(status)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [status]);

  return { data, loading, error };
}

/**
 * Hook для статистики чтения
 */
export function useReadingStats() {
  const [data, setData] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mindService
      .getReadingStats()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, loading, error };
}
