# Решение проблем с переключением тем

## Проблема
Переключение тем не работает - атрибут `data-theme` не устанавливается на `<html>` элементе.

## Решение

### 1. Проверка работы

Откройте `http://localhost:3000/theme-test` - это тестовая страница для отладки тем.

На странице отображается:
- Текущая тема (theme)
- Разрешённая тема (resolvedTheme)
- Доступные темы
- Кнопки для переключения
- Тестовые блоки цветов

### 2. Как это работает

**ThemeProvider** обёртывает всё приложение и использует `next-themes`:

```tsx
<ThemeProvider
  attribute="data-theme"        // Используем data-theme атрибут
  defaultTheme="system"         // По умолчанию системная
  enableSystem                  // Разрешить системную тему
  storageKey="lifeos-theme"     // Ключ в localStorage
  themes={['light', 'dark', 'high-contrast']}
>
```

**ThemeSwitcher** использует хук `useTheme()`:

```tsx
const { theme, setTheme } = useTheme();

// Переключение
setTheme('light');
setTheme('dark');
setTheme('high-contrast');
setTheme('system');
```

### 3. CSS селекторы

Темы работают через CSS переменные:

```css
:root,
[data-theme="light"] {
  --background: oklch(1 0 0);
  --primary: oklch(0.55 0.12 260);
  /* ... */
}

[data-theme="dark"] {
  --background: oklch(0.14 0.005 250);
  --primary: oklch(0.65 0.14 260);
  /* ... */
}

[data-theme="high-contrast"] {
  --background: oklch(1 0 0);
  --foreground: oklch(0 0 0);
  /* ... */
}
```

### 4. Проверка в браузере

1. Откройте DevTools (F12)
2. Перейдите на вкладку Elements
3. Найдите `<html>` элемент
4. Проверьте атрибут `data-theme`
5. При переключении темы атрибут должен меняться

### 5. Частые проблемы

**Проблема:** Атрибут не меняется
**Решение:** Проверьте, что ThemeProvider обёртывает всё приложение

**Проблема:** Тема сбрасывается после перезагрузки
**Решение:** next-themes автоматически сохраняет в localStorage, проверьте ключ `lifeos-theme`

**Проблема:** Мигание при загрузке
**Решение:** Это нормально для SSR. ThemeSwitcher показывает placeholder до монтирования.

### 6. Отключение тем

Если нужно принудительно установить тему:

```tsx
<ThemeProvider forcedTheme="dark">
  {/* Всегда тёмная тема */}
</ThemeProvider>
```

### 7. Добавление новой темы

1. Добавьте тему в массив `themes`
2. Добавьте CSS селектор в globals.css
3. Определите все CSS переменные

```css
[data-theme="custom"] {
  --background: oklch(...);
  --foreground: oklch(...);
  /* все переменные */
}
```
