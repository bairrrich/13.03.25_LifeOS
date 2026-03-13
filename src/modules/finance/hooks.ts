/**
 * Finance Module Hooks
 * React hooks для финансового модуля
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Transaction, Account, Category, Budget } from './types';
import * as financeService from './services';

/**
 * Hook для получения транзакций
 */
export function useTransactions(options?: {
  accountId?: string;
  categoryId?: string;
  type?: 'expense' | 'income' | 'transfer';
  limit?: number;
}) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const transactions = await financeService.getTransactions(options);
      setData(transactions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(options || {})]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { data, loading, error, refetch: fetchTransactions };
}

/**
 * Hook для получения счетов
 */
export function useAccounts(type?: Account['type']) {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    financeService
      .getAccounts(type)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [type]);

  return { data, loading, error };
}

/**
 * Hook для получения категорий
 */
export function useCategories(type?: Category['type']) {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    financeService
      .getCategories(type)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [type]);

  return { data, loading, error };
}

/**
 * Hook для получения бюджетов
 */
export function useBudgets(period?: Budget['period']) {
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    financeService
      .getBudgets(period)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [period]);

  return { data, loading, error };
}

/**
 * Hook для получения баланса счёта
 */
export function useAccountBalance(accountId: string) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    financeService
      .getAccountBalance(accountId)
      .then(setBalance)
      .catch((err) => setError(err.message));
  }, [accountId]);

  return { balance, loading, error };
}

/**
 * Hook для получения общего баланса
 */
export function useTotalBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    financeService
      .getTotalBalance()
      .then(setBalance)
      .catch((err) => setError(err.message));
  }, []);

  return { balance, loading, error };
}

/**
 * Hook для получения месячных расходов
 */
export function useMonthlyExpenses(year: number, month: number) {
  const [expenses, setExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    financeService
      .getMonthlyExpenses(year, month)
      .then(setExpenses)
      .catch((err) => setError(err.message));
  }, [year, month]);

  return { expenses, loading, error };
}
