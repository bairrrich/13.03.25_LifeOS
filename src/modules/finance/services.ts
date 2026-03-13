/**
 * Finance Module Services
 * Сервисы для финансового модуля
 */

import {
  createEntity,
  updateEntity,
  deleteEntity,
  listEntities,
  getEntity,
  query,
  aggregate,
} from '@/core';
import type { BaseEntity } from '@/shared/types';
import type { Transaction, Account, Category, Budget } from './types';

const USER_ID = 'default-user';

// ==================== Transactions ====================

export async function createTransaction(
  data: Omit<Transaction, keyof BaseEntity>
): Promise<Transaction> {
  return createEntity<Transaction>('transactions', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
): Promise<Transaction | undefined> {
  return updateEntity<Transaction>('transactions', id, data);
}

export async function deleteTransaction(id: string): Promise<boolean> {
  return deleteEntity('transactions', id);
}

export async function getTransaction(id: string): Promise<Transaction | undefined> {
  return getEntity<Transaction>('transactions', id);
}

export async function getTransactions(options?: {
  accountId?: string;
  categoryId?: string;
  type?: 'expense' | 'income' | 'transfer';
  startDate?: number;
  endDate?: number;
  limit?: number;
}): Promise<Transaction[]> {
  let q = query<Transaction>('transactions').userId(USER_ID);

  if (options?.accountId) {
    q = q.where('account_id', 'eq', options.accountId);
  }
  if (options?.categoryId) {
    q = q.where('category_id', 'eq', options.categoryId);
  }
  if (options?.type) {
    q = q.where('type', 'eq', options.type);
  }
  if (options?.startDate) {
    q = q.where('date', 'gte', options.startDate);
  }
  if (options?.endDate) {
    q = q.where('date', 'lte', options.endDate);
  }

  q = q.orderBy('date', 'desc');

  if (options?.limit) {
    q = q.take(options.limit);
  }

  return q.all();
}

export async function getTransactionsByAccount(
  accountId: string
): Promise<Transaction[]> {
  return getTransactions({ accountId });
}

export async function getAccountBalance(
  accountId: string
): Promise<number> {
  const result = await aggregate({
    entity: 'transactions',
    field: 'amount',
    type: 'sum',
    filter: { account_id: accountId },
    user_id: USER_ID,
  });

  return result as number;
}

export async function getMonthlyExpenses(
  year: number,
  month: number
): Promise<number> {
  const startDate = new Date(year, month - 1, 1).getTime();
  const endDate = new Date(year, month, 0).getTime();

  const result = await aggregate({
    entity: 'transactions',
    field: 'amount',
    type: 'sum',
    filter: {
      type: 'expense',
      date: { between: [startDate, endDate] },
    },
    user_id: USER_ID,
  });

  return result as number;
}

export async function getMonthlyIncome(
  year: number,
  month: number
): Promise<number> {
  const startDate = new Date(year, month - 1, 1).getTime();
  const endDate = new Date(year, month, 0).getTime();

  const result = await aggregate({
    entity: 'transactions',
    field: 'amount',
    type: 'sum',
    filter: {
      type: 'income',
      date: { between: [startDate, endDate] },
    },
    user_id: USER_ID,
  });

  return result as number;
}

// ==================== Accounts ====================

export async function createAccount(
  data: Omit<Account, keyof BaseEntity>
): Promise<Account> {
  return createEntity<Account>('accounts', {
    ...data,
    user_id: USER_ID,
    balance: data.balance || 0,
  });
}

export async function updateAccount(
  id: string,
  data: Partial<Account>
): Promise<Account | undefined> {
  return updateEntity<Account>('accounts', id, data);
}

export async function deleteAccount(id: string): Promise<boolean> {
  return deleteEntity('accounts', id);
}

export async function getAccount(id: string): Promise<Account | undefined> {
  return getEntity<Account>('accounts', id);
}

export async function getAccounts(type?: Account['type']): Promise<Account[]> {
  if (type) {
    const result = await query<Account>('accounts')
      .userId(USER_ID)
      .where('type', 'eq', type)
      .execute();
    return result.data;
  }

  const result = await query<Account>('accounts').userId(USER_ID).execute();
  return result.data;
}

export async function getTotalBalance(): Promise<number> {
  const accounts = await getAccounts();
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}

// ==================== Categories ====================

export async function createCategory(
  data: Omit<Category, keyof BaseEntity>
): Promise<Category> {
  return createEntity<Category>('categories', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category | undefined> {
  return updateEntity<Category>('categories', id, data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  return deleteEntity('categories', id);
}

export async function getCategory(id: string): Promise<Category | undefined> {
  return getEntity<Category>('categories', id);
}

export async function getCategories(
  type?: Category['type']
): Promise<Category[]> {
  if (type) {
    const result = await query<Category>('categories')
      .userId(USER_ID)
      .where('type', 'eq', type)
      .execute();
    return result.data;
  }

  const result = await query<Category>('categories').userId(USER_ID).execute();
  return result.data;
}

// ==================== Budgets ====================

export async function createBudget(
  data: Omit<Budget, keyof BaseEntity>
): Promise<Budget> {
  return createEntity<Budget>('budgets', {
    ...data,
    user_id: USER_ID,
  });
}

export async function updateBudget(
  id: string,
  data: Partial<Budget>
): Promise<Budget | undefined> {
  return updateEntity<Budget>('budgets', id, data);
}

export async function deleteBudget(id: string): Promise<boolean> {
  return deleteEntity('budgets', id);
}

export async function getBudget(id: string): Promise<Budget | undefined> {
  return getEntity<Budget>('budgets', id);
}

export async function getBudgets(
  period?: Budget['period']
): Promise<Budget[]> {
  if (period) {
    const result = await query<Budget>('budgets')
      .userId(USER_ID)
      .where('period', 'eq', period)
      .execute();
    return result.data;
  }

  const result = await query<Budget>('budgets').userId(USER_ID).execute();
  return result.data;
}

export async function getBudgetByCategory(
  categoryId: string
): Promise<Budget | undefined> {
  const result = await query<Budget>('budgets')
    .userId(USER_ID)
    .where('category_id', 'eq', categoryId)
    .first();

  return result ?? undefined;
}
