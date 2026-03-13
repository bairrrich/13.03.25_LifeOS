/**
 * Finance Module Types
 * Типы для финансового модуля
 */

import type { BaseEntity } from '@/shared/types';

/**
 * Транзакция
 */
export interface Transaction extends BaseEntity {
  account_id: string;
  category_id: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income' | 'transfer';
  date: number;
  description?: string;
}

/**
 * Счёт
 */
export interface Account extends BaseEntity {
  name: string;
  type: 'cash' | 'bank' | 'card' | 'investment';
  currency: string;
  balance: number;
  icon?: string;
  color?: string;
}

/**
 * Категория
 */
export interface Category extends BaseEntity {
  name: string;
  type: 'income' | 'expense';
  parent_id?: string;
  icon?: string;
  color?: string;
}

/**
 * Бюджет
 */
export interface Budget extends BaseEntity {
  name: string;
  category_id: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: number;
  end_date?: number;
}

/**
 * Типы транзакций для фильтра
 */
export type TransactionType = Transaction['type'];

/**
 * Типы счетов
 */
export type AccountType = Account['type'];

/**
 * Периоды бюджета
 */
export type BudgetPeriod = Budget['period'];
