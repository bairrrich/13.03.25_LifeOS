'use client';

import * as React from 'react';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Badge } from './badge';
import { notificationService, type Notification } from '@/core/notifications';
import { useTranslation } from '@/shared/lib/use-translation';

export function NotificationCenter() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [stats, setStats] = React.useState({ unread: 0 });

  const loadNotifications = React.useCallback(() => {
    const all = notificationService.getAll({ limit: 20 });
    setNotifications(all);
    setStats({ unread: notificationService.getStats().unread });
  }, []);

  React.useEffect(() => {
    loadNotifications();
    return notificationService.subscribe(loadNotifications);
  }, [loadNotifications]);

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDismiss = (id: string) => {
    notificationService.dismiss(id);
  };

  const handleDismissAll = () => {
    notificationService.dismissAll();
  };

  const handleDismissRead = () => {
    notificationService.dismissRead();
  };

  const formatTime = React.useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications.justNow');
    if (minutes < 60) return t('notifications.minutesAgo').replace('{minutes}', String(minutes));
    if (hours < 24) return t('notifications.hoursAgo').replace('{hours}', String(hours));
    return t('notifications.daysAgo').replace('{days}', String(days));
  }, [t]);

  const typeIcons: Record<Notification['type'], string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {stats.unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {stats.unread > 9 ? '9+' : stats.unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b">
          <h3 className="font-semibold">{t('notifications.title')}</h3>
          {stats.unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-sm">{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b hover:bg-accent/50 transition-colors ${!notification.read ? 'bg-accent/20' : ''
                  }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{typeIcons[notification.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    {notification.message && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {t('notifications.markRead')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        {t('notifications.dismiss')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleDismissRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                {t('notifications.clearRead')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleDismissAll}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {t('notifications.clearAll')}
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
