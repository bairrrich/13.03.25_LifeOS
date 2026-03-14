'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/ui/layout/app-layout';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Select } from '@/ui/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/ui/components/dialog';
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2, Pencil, CreditCard, Building, PiggyBank } from 'lucide-react';
import { Badge } from '@/ui/components/badge';

interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'card' | 'investment';
  currency: string;
  balance: number;
  icon?: string;
  color?: string;
}

const mockAccounts: Account[] = [
  { id: '1', name: 'Наличные', type: 'cash', currency: 'EUR', balance: 450 },
  { id: '2', name: 'Основной счёт', type: 'bank', currency: 'EUR', balance: 8500 },
  { id: '3', name: 'Visa Card', type: 'card', currency: 'EUR', balance: 1250 },
  { id: '4', name: 'Инвестиции', type: 'investment', currency: 'EUR', balance: 5220 },
];

export default function AccountsPage() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const byType = {
    cash: accounts.filter(a => a.type === 'cash').reduce((sum, a) => sum + a.balance, 0),
    bank: accounts.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.balance, 0),
    card: accounts.filter(a => a.type === 'card').reduce((sum, a) => sum + a.balance, 0),
    investment: accounts.filter(a => a.type === 'investment').reduce((sum, a) => sum + a.balance, 0),
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newAccount: Account = {
      id: editingAccount?.id || Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as Account['type'],
      currency: formData.get('currency') as string,
      balance: Number(formData.get('balance')),
    };

    if (editingAccount) {
      setAccounts(accounts.map(a => a.id === editingAccount.id ? newAccount : a));
    } else {
      setAccounts([...accounts, newAccount]);
    }

    setIsDialogOpen(false);
    setEditingAccount(null);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const getTypeIcon = (type: Account['type']) => {
    const icons = {
      cash: <PiggyBank className="h-6 w-6" />,
      bank: <Building className="h-6 w-6" />,
      card: <CreditCard className="h-6 w-6" />,
      investment: <TrendingUp className="h-6 w-6" />,
    };
    return icons[type];
  };

  const getTypeColor = (type: Account['type']) => {
    const colors = {
      cash: 'bg-green-100 text-green-600',
      bank: 'bg-blue-100 text-blue-600',
      card: 'bg-purple-100 text-purple-600',
      investment: 'bg-orange-100 text-orange-600',
    };
    return colors[type];
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('finance.accounts')}</h1>
            <p className="text-muted-foreground">{t('finance.balance')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAccount(null)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('finance.addAccount')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? t('common.edit') : t('finance.addAccount')}
                </DialogTitle>
                <DialogDescription>
                  {t('finance.addAccount')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" label={t('finance.accountName')} defaultValue={editingAccount?.name} required />
                <Select
                  name="type"
                  label={t('finance.accountType')}
                  defaultValue={editingAccount?.type || 'cash'}
                  options={[
                    { value: 'cash', label: 'Наличные' },
                    { value: 'bank', label: 'Банковский счёт' },
                    { value: 'card', label: 'Банковская карта' },
                    { value: 'investment', label: 'Инвестиции' },
                  ]}
                />
                <Select
                  name="currency"
                  label={t('finance.currency')}
                  defaultValue={editingAccount?.currency || 'EUR'}
                  options={[
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'USD', label: 'USD - US Dollar' },
                  ]}
                />
                <Input
                  name="balance"
                  type="number"
                  step="0.01"
                  label={t('finance.balance')}
                  defaultValue={editingAccount?.balance}
                  required
                />
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingAccount ? t('common.update') : t('common.create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Общий баланс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalBalance.toFixed(2)} €</div>
          </CardContent>
        </Card>

        {/* Balance by Type */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Наличные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{byType.cash.toFixed(2)} €</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Счета</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{byType.bank.toFixed(2)} €</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Карты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{byType.card.toFixed(2)} €</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Инвестиции</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{byType.investment.toFixed(2)} €</div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getTypeColor(account.type)}`}>
                      {getTypeIcon(account.type)}
                    </div>
                    <div>
                      <CardTitle>{account.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{account.type}</Badge>
                        <span className="text-xs text-muted-foreground">{account.currency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{account.balance.toFixed(2)} €</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(account)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
