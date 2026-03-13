'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/ui/components/button';
import { ThemeSwitcher } from '@/ui/components/theme-switcher';
import { LanguageSwitcher } from '@/ui/components/language-switcher';
import {
  LayoutDashboard,
  Wallet,
  Utensils,
  Dumbbell,
  Heart,
  CheckCircle2,
  Target,
  Brain,
  Sparkles,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'nav.dashboard', href: '/', icon: LayoutDashboard },
  { name: 'nav.finance', href: '/finance', icon: Wallet },
  { name: 'nav.nutrition', href: '/nutrition', icon: Utensils },
  { name: 'nav.workouts', href: '/workouts', icon: Dumbbell },
  { name: 'nav.health', href: '/health', icon: Heart },
  { name: 'nav.habits', href: '/habits', icon: CheckCircle2 },
  { name: 'nav.goals', href: '/goals', icon: Target },
  { name: 'nav.mind', href: '/mind', icon: Brain },
  { name: 'nav.beauty', href: '/beauty', icon: Sparkles },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Sidebar для десктопа */}
      <aside className="hidden fixed inset-y-0 left-0 w-64 border-r border-border md:block" style={{ background: 'var(--card)' }}>
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/" className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            LifeOS
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    isActive && 'bg-accent'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              nav.settings
            </Button>
          </Link>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="md:pl-64">
        {/* Header для мобильных */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-border px-4 backdrop-blur md:hidden" style={{ background: 'var(--background)' }}>
          <Link href="/" className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            LifeOS
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </header>

        {/* Контент страницы */}
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {/* Bottom Navigation для мобильных */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-border md:hidden" style={{ background: 'var(--background)' }}>
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'w-full flex-col gap-1 rounded-none p-2 text-xs',
                  isActive && 'text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px]" style={{ color: 'var(--foreground)' }}>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
