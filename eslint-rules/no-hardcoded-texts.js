/**
 * ESLint правило для обнаружения захардкоженных текстов
 * Вместо t('key') должны использоваться переводы
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded strings that should be translated',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      hardcodedString:
        'Hardcoded string "{{text}}" found. Use t("key") for translations instead.',
    },
  },
  create(context) {
    const filename = context.getFilename();

    // Игнорируем не React/TS файлы
    if (
      !filename.endsWith('.tsx') &&
      !filename.endsWith('.jsx')
    ) {
      return {};
    }

    // Игнорируем файлы с локализацией
    if (
      filename.includes('i18n') ||
      filename.includes('locale') ||
      filename.includes('translation')
    ) {
      return {};
    }

    // Список разрешённых захардкоженных строк
    const allowedStrings = [
      '€', '$', '£', '%',
      'kg', 'g', 'km', 'm', 'cm',
      'kcal', 'h', 'min', 'sec',
      'ru', 'en',
      'light', 'dark', 'system',
      'active', 'completed', 'paused', 'abandoned',
      'expense', 'income', 'transfer',
      'cash', 'bank', 'card', 'investment',
      'daily', 'weekly', 'monthly', 'yearly',
      'breakfast', 'lunch', 'dinner', 'snack',
      'morning', 'evening', 'night',
      'poor', 'fair', 'good', 'excellent',
      'beginner', 'intermediate', 'advanced',
      'skincare', 'haircare', 'makeup', 'fragrance', 'body',
      'finance', 'nutrition', 'workouts', 'health', 'habits', 'goals', 'mind', 'beauty', 'settings', 'dashboard',
      'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'grid', 'flex', 'block', 'inline', 'hidden',
      'text', 'font', 'font-bold', 'font-semibold', 'font-medium',
      'h-', 'w-', 'p-', 'm-', 'gap-', 'space-',
      'bg-', 'border', 'rounded', 'shadow',
      'items-center', 'justify-center', 'justify-between',
      'flex-col', 'flex-row',
      'absolute', 'relative', 'fixed', 'sticky',
      'top-', 'bottom-', 'left-', 'right-',
      'z-', 'opacity', 'transition',
      'hover', 'focus', 'active',
      'disabled', 'checked', 'selected',
    ];

    // Проверяем является ли строка CSS классом
    const isCssClass = (text) => {
      // Tailwind классы
      const tailwindPattern = /^(text|bg|border|font|h|w|p|m|gap|space|rounded|shadow|z|opacity|transition|flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|top|bottom|left|right|hover|focus|active|disabled|checked|selected|items|justify|flex|flex-col|flex-row|font-bold|font-semibold|font-medium|text-muted|text-primary|text-destructive|border-border|bg-background|bg-card|bg-accent|bg-secondary|bg-muted|text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|tracking-tight|antialiased)/;
      return tailwindPattern.test(text);
    };

    // Проверяем является ли строка ключом перевода
    const isTranslationKey = (text, node) => {
      // Проверяем используется ли строка как аргумент t()
      if (
        node.parent &&
        node.parent.type === 'CallExpression' &&
        node.parent.callee &&
        node.parent.callee.name === 't'
      ) {
        return true;
      }

      // Проверяем содержит ли строка точку (ключ перевода)
      if (text.includes('.')) {
        const parts = text.split('.');
        if (parts.length >= 2 && parts[0].length > 1) {
          return true;
        }
      }

      return false;
    };

    return {
      Literal(node) {
        if (typeof node.value !== 'string') {
          return;
        }

        const text = node.value;

        // Игнорируем пустые строки
        if (!text || text.length === 0) {
          return;
        }

        // Игнорируем короткие строки (1-2 символа)
        if (text.length <= 2) {
          return;
        }

        // Игнорируем ключи объектов
        if (node.parent.type === 'Property' && node.parent.key === node) {
          return;
        }

        // Игнорируем импорты
        if (
          node.parent.type === 'ImportDeclaration' ||
          node.parent.type === 'ExportNamedDeclaration' ||
          node.parent.type === 'ExportAllDeclaration'
        ) {
          return;
        }

        // Игнорируем разрешённые строки
        if (allowedStrings.some(s => text.toLowerCase().includes(s))) {
          return;
        }

        // Игнорируем CSS классы
        if (isCssClass(text)) {
          return;
        }

        // Игнорируем ключи переводов
        if (isTranslationKey(text, node)) {
          return;
        }

        // Игнорируем пути и URL
        if (text.includes('/') || text.includes('\\') || text.includes('://')) {
          return;
        }

        // Игнорируем классы CSS (начинаются с . или #)
        if (text.startsWith('.') || text.startsWith('#')) {
          return;
        }

        // Игнорируем data attributes
        if (text.startsWith('data-') || text.startsWith('aria-')) {
          return;
        }

        // Игнорируем HTML теги
        if (text.startsWith('<') || text.endsWith('>')) {
          return;
        }

        // Игнорируем специальные символы
        if (/^[\s\d.,\-+:;()\[\]{}\\/]+$/.test(text)) {
          return;
        }

        // Проверяем контекст
        if (
          node.parent.type === 'JSXAttribute' ||
          (node.parent.type === 'CallExpression' && node.parent.callee.name !== 't') ||
          node.parent.type === 'VariableDeclarator'
        ) {
          // Игнорируем импорты и require
          if (
            node.parent.type === 'CallExpression' &&
            (node.parent.callee.name === 'require' ||
              node.parent.callee.name === 'import' ||
              node.parent.callee.name === 'define')
          ) {
            return;
          }

          context.report({
            node,
            messageId: 'hardcodedString',
            data: {
              text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            },
          });
        }
      },
    };
  },
};
