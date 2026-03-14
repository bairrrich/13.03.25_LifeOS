/**
 * Тесты для Notification Service
 */

import { NotificationService } from '@/core/notifications/notification-service';
import type { Notification } from '@/core/notifications';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
    jest.clearAllMocks();
    service = new NotificationService();
  });

  describe('create', () => {
    it('должен создать уведомление и вернуть ID', () => {
      const id = service.create({
        type: 'info',
        priority: 'medium',
        title: 'Test Notification',
        message: 'This is a test',
      });

      expect(id).toBeDefined();
      expect(id.length).toBeGreaterThan(0);
    });

    it('должен сохранить уведомление в хранилище', () => {
      const id = service.create({
        type: 'success',
        priority: 'high',
        title: 'Success!',
        message: 'Operation completed',
      });

      const notification = service.get(id);

      expect(notification).toBeDefined();
      expect(notification?.title).toBe('Success!');
      expect(notification?.type).toBe('success');
      expect(notification?.read).toBe(false);
    });

    it('не должен создавать уведомление если сервис отключён', () => {
      service.updateSettings({ enabled: false });

      const id = service.create({
        type: 'info',
        priority: 'medium',
        title: 'Disabled',
        message: 'Should not be created',
      });

      expect(id).toBe('');
    });

    it('должен установить timestamp при создании', () => {
      const before = Date.now();
      const id = service.create({
        type: 'info',
        priority: 'medium',
        title: 'Test',
        message: 'Test',
      });
      const after = Date.now();

      const notification = service.get(id);

      expect(notification?.timestamp).toBeGreaterThanOrEqual(before);
      expect(notification?.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('getAll', () => {
    it('должен вернуть все уведомления', () => {
      service.create({ type: 'info', priority: 'medium', title: 'Test 1', message: '' });
      service.create({ type: 'success', priority: 'high', title: 'Test 2', message: '' });
      service.create({ type: 'error', priority: 'high', title: 'Test 3', message: '' });

      const all = service.getAll();

      expect(all.length).toBe(3);
    });

    it('должен фильтровать по типу', () => {
      service.create({ type: 'info', priority: 'medium', title: 'Info 1', message: '' });
      service.create({ type: 'success', priority: 'medium', title: 'Success 1', message: '' });
      service.create({ type: 'info', priority: 'medium', title: 'Info 2', message: '' });

      const infoOnly = service.getAll({ type: 'info' });

      expect(infoOnly.length).toBe(2);
      expect(infoOnly.every(n => n.type === 'info')).toBe(true);
    });

    it('должен фильтровать по статусу прочтения', () => {
      const id1 = service.create({ type: 'info', priority: 'medium', title: 'Unread', message: '' });
      service.create({ type: 'info', priority: 'medium', title: 'Read', message: '' });

      service.markAsRead(id1);

      const unread = service.getAll({ read: false });

      expect(unread.length).toBe(1);
      expect(unread[0].title).toBe('Read');
    });

    it('должен сортировать по времени (новые сначала)', () => {
      service.create({ type: 'info', priority: 'medium', title: 'First', message: '' });
      
      // Небольшая задержка для различия во времени
      const start = Date.now();
      while (Date.now() === start) { /* wait */ }
      
      service.create({ type: 'info', priority: 'medium', title: 'Second', message: '' });

      const all = service.getAll();

      expect(all[0].title).toBe('Second');
      expect(all[1].title).toBe('First');
    });

    it('должен ограничивать количество через limit', () => {
      service.create({ type: 'info', priority: 'medium', title: '1', message: '' });
      service.create({ type: 'info', priority: 'medium', title: '2', message: '' });
      service.create({ type: 'info', priority: 'medium', title: '3', message: '' });

      const limited = service.getAll({ limit: 2 });

      expect(limited.length).toBe(2);
    });
  });

  describe('markAsRead', () => {
    it('должен отметить уведомление как прочитанное', () => {
      const id = service.create({ type: 'info', priority: 'medium', title: 'Test', message: '' });

      service.markAsRead(id);

      const notification = service.get(id);
      expect(notification?.read).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('должен отметить все уведомления как прочитанные', () => {
      service.create({ type: 'info', priority: 'medium', title: '1', message: '' });
      service.create({ type: 'success', priority: 'medium', title: '2', message: '' });
      service.create({ type: 'error', priority: 'medium', title: '3', message: '' });

      service.markAllAsRead();

      const all = service.getAll();
      expect(all.every(n => n.read)).toBe(true);
    });
  });

  describe('dismiss', () => {
    it('должен удалить уведомление по ID', () => {
      const id = service.create({ type: 'info', priority: 'medium', title: 'Test', message: '' });

      service.dismiss(id);

      const notification = service.get(id);
      expect(notification).toBeUndefined();
    });
  });

  describe('dismissAll', () => {
    it('должен удалить все уведомления', () => {
      service.create({ type: 'info', priority: 'medium', title: '1', message: '' });
      service.create({ type: 'success', priority: 'medium', title: '2', message: '' });
      service.create({ type: 'error', priority: 'medium', title: '3', message: '' });

      service.dismissAll();

      const all = service.getAll();
      expect(all.length).toBe(0);
    });
  });

  describe('dismissRead', () => {
    it('должен удалить только прочитанные уведомления', () => {
      const id1 = service.create({ type: 'info', priority: 'medium', title: 'Unread', message: '' });
      const id2 = service.create({ type: 'success', priority: 'medium', title: 'Read', message: '' });

      service.markAsRead(id2);
      service.dismissRead();

      const remaining = service.getAll();
      expect(remaining.length).toBe(1);
      expect(remaining[0].title).toBe('Unread');
    });
  });

  describe('getStats', () => {
    it('должен вернуть правильную статистику', () => {
      service.create({ type: 'info', priority: 'low', title: '1', message: '' });
      service.create({ type: 'success', priority: 'medium', title: '2', message: '' });
      const id3 = service.create({ type: 'error', priority: 'high', title: '3', message: '' });

      service.markAsRead(id3);

      const stats = service.getStats();

      expect(stats.total).toBe(3);
      expect(stats.unread).toBe(2);
      expect(stats.byType.info).toBe(1);
      expect(stats.byType.success).toBe(1);
      expect(stats.byType.error).toBe(1);
      expect(stats.byPriority.low).toBe(1);
      expect(stats.byPriority.medium).toBe(1);
      expect(stats.byPriority.high).toBe(1);
    });
  });

  describe('updateSettings', () => {
    it('должен обновить настройки', () => {
      service.updateSettings({
        enabled: false,
        sound: true,
        maxVisible: 10,
      });

      const settings = service.getSettings();

      expect(settings.enabled).toBe(false);
      expect(settings.sound).toBe(true);
      expect(settings.maxVisible).toBe(10);
    });

    it('должен сохранить настройки в localStorage', () => {
      service.updateSettings({ enabled: false });

      const saved = localStorage.getItem('lifeos-notification-settings');
      expect(saved).toBeDefined();

      const parsed = JSON.parse(saved!);
      expect(parsed.enabled).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('должен загрузить уведомления из localStorage при инициализации', () => {
      const testNotification: Notification = {
        id: 'test-id',
        type: 'info',
        priority: 'medium',
        title: 'Persisted',
        message: 'Test',
        timestamp: Date.now(),
        read: false,
      };

      localStorage.setItem('lifeos-notifications', JSON.stringify([testNotification]));

      const newService = new NotificationService();
      const notification = newService.get('test-id');

      expect(notification).toBeDefined();
      expect(notification?.title).toBe('Persisted');
    });

    it('должен сохранить уведомления в localStorage', () => {
      service.create({ type: 'info', priority: 'medium', title: 'Test', message: '' });

      const saved = localStorage.getItem('lifeos-notifications');
      expect(saved).toBeDefined();

      const parsed = JSON.parse(saved!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].title).toBe('Test');
    });
  });

  describe('templates', () => {
    it('должен создать уведомление о превышении бюджета', () => {
      const id = service.templates.budgetExceeded({
        category: 'Еда',
        amount: 150,
        budget: 100,
      });

      const notification = service.get(id);

      expect(notification).toBeDefined();
      expect(notification?.type).toBe('warning');
      expect(notification?.priority).toBe('high');
      expect(notification?.title).toBe('Превышение бюджета');
    });

    it('должен создать уведомление о выполненной привычке', () => {
      const id = service.templates.habitCompleted({
        habitName: 'Чтение',
        streak: 7,
      });

      const notification = service.get(id);

      expect(notification).toBeDefined();
      expect(notification?.type).toBe('success');
      expect(notification?.title).toContain('Привычка выполнена');
    });

    it('должен создать уведомление о достигнутой цели', () => {
      const id = service.templates.goalCompleted({
        goalName: 'Выучить английский',
      });

      const notification = service.get(id);

      expect(notification).toBeDefined();
      expect(notification?.type).toBe('success');
      expect(notification?.priority).toBe('high');
    });

    it('должен создать уведомление об ошибке автоматизации', () => {
      const id = service.templates.automationError({
        ruleName: 'Тестовое правило',
        error: 'Network error',
      });

      const notification = service.get(id);

      expect(notification).toBeDefined();
      expect(notification?.type).toBe('error');
      expect(notification?.priority).toBe('high');
    });
  });
});
