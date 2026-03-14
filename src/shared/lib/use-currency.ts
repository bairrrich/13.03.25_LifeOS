'use client';

import { useEffect, useState } from 'react';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'RUB';

export const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  RUB: '₽',
};

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('EUR');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lifeos-currency') : null;
    if (stored && ['EUR', 'USD', 'GBP', 'RUB'].includes(stored)) {
      setCurrency(stored as Currency);
    }
  }, []);

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(2)}${currencySymbols[currency]}`;
  };

  return {
    currency,
    symbol: currencySymbols[currency],
    formatCurrency,
  };
}
