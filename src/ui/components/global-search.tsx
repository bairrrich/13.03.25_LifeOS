'use client';

import * as React from 'react';
import { Search, FileText, TrendingUp, CheckCircle2, Dumbbell, Heart, Target, Book, Sparkles, Wallet, Utensils } from 'lucide-react';
import { useTranslation } from '@/shared/lib/use-translation';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { Card, CardContent } from '@/ui/components/card';
import { Badge } from '@/ui/components/badge';

interface SearchResult {
  id: string;
  type: 'transaction' | 'habit' | 'workout' | 'goal' | 'book' | 'cosmetic' | 'food';
  title: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GlobalSearchProps {
  transactions?: Array<{ id: string; name: string; amount: number; category: string }>;
  habits?: Array<{ id: string; name: string; streak: number }>;
  workouts?: Array<{ id: string; name: string; date: number }>;
  goals?: Array<{ id: string; name: string; progress: number }>;
  books?: Array<{ id: string; title: string; author?: string }>;
  foods?: Array<{ id: string; name: string; calories: number }>;
  cosmetics?: Array<{ id: string; name: string; brand?: string }>;
}

export function GlobalSearch({
  transactions = [],
  habits = [],
  workouts = [],
  goals = [],
  books = [],
  foods = [],
  cosmetics = [],
}: GlobalSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const searchQuery = query.toLowerCase();

    // Search transactions
    transactions
      .filter((t) => t.name.toLowerCase().includes(searchQuery) || t.category.toLowerCase().includes(searchQuery))
      .forEach((t) => {
        searchResults.push({
          id: `transaction-${t.id}`,
          type: 'transaction',
          title: t.name,
          description: `${t.category} • ${t.amount}€`,
          href: '/finance',
          icon: Wallet,
        });
      });

    // Search habits
    habits
      .filter((h) => h.name.toLowerCase().includes(searchQuery))
      .forEach((h) => {
        searchResults.push({
          id: `habit-${h.id}`,
          type: 'habit',
          title: h.name,
          description: `${h.streak} ${t('habits.streak')}`,
          href: '/habits',
          icon: CheckCircle2,
        });
      });

    // Search workouts
    workouts
      .filter((w) => w.name.toLowerCase().includes(searchQuery))
      .forEach((w) => {
        searchResults.push({
          id: `workout-${w.id}`,
          type: 'workout',
          title: w.name,
          description: new Date(w.date).toLocaleDateString('ru-RU'),
          href: '/workouts',
          icon: Dumbbell,
        });
      });

    // Search goals
    goals
      .filter((g) => g.name.toLowerCase().includes(searchQuery))
      .forEach((g) => {
        searchResults.push({
          id: `goal-${g.id}`,
          type: 'goal',
          title: g.name,
          description: `${g.progress}% ${t('goals.progress')}`,
          href: '/goals',
          icon: Target,
        });
      });

    // Search books
    books
      .filter((b) => b.title.toLowerCase().includes(searchQuery) || (b.author && b.author.toLowerCase().includes(searchQuery)))
      .forEach((b) => {
        searchResults.push({
          id: `book-${b.id}`,
          type: 'book',
          title: b.title,
          description: b.author,
          href: '/mind',
          icon: Book,
        });
      });

    // Search foods
    foods
      .filter((f) => f.name.toLowerCase().includes(searchQuery))
      .forEach((f) => {
        searchResults.push({
          id: `food-${f.id}`,
          type: 'food',
          title: f.name,
          description: `${f.calories} kcal`,
          href: '/nutrition',
          icon: Utensils,
        });
      });

    // Search cosmetics
    cosmetics
      .filter((c) => c.name.toLowerCase().includes(searchQuery) || (c.brand && c.brand.toLowerCase().includes(searchQuery)))
      .forEach((c) => {
        searchResults.push({
          id: `cosmetic-${c.id}`,
          type: 'cosmetic',
          title: c.name,
          description: c.brand,
          href: '/beauty',
          icon: Sparkles,
        });
      });

    setResults(searchResults.slice(0, 10));
  }, [query, transactions, habits, workouts, goals, books, foods, cosmetics]);

  const getTypeColor = (type: SearchResult['type']) => {
    const colors = {
      transaction: 'bg-green-100 text-green-700',
      habit: 'bg-blue-100 text-blue-700',
      workout: 'bg-orange-100 text-orange-700',
      goal: 'bg-purple-100 text-purple-700',
      book: 'bg-yellow-100 text-yellow-700',
      cosmetic: 'bg-pink-100 text-pink-700',
      food: 'bg-red-100 text-red-700',
    };
    return colors[type];
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl bg-background rounded-lg shadow-lg border">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('globalSearch.placeholder')}
              className="border-0 focus-visible:ring-0 px-0"
              autoFocus
            />
            <Badge variant="outline" className="shrink-0">⌘K</Badge>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {results.length === 0 && query.trim() && (
            <div className="text-center py-8 text-muted-foreground">
              {t('globalSearch.noResults')}
            </div>
          )}

          {results.length === 0 && !query.trim() && (
            <div className="text-center py-8 text-muted-foreground">
              {t('globalSearch.typeHint')}
            </div>
          )}

          <div className="space-y-2">
            {results.map((result) => (
              <Card key={result.id} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`p-2 rounded ${getTypeColor(result.type)}`}>
                    <result.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {result.type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
