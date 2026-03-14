# Code Style & Conventions

## TypeScript
- Strict mode enabled
- No implicit any
- Module resolution: bundler
- Paths: @/* -> ./src/*

## ESLint
- Extends: next/core-web-vitals, prettier
- Rules:
  - prettier/prettier: error
  - react-hooks/set-state-in-effect: off
  - @typescript-eslint/no-explicit-any: warn
  - @next/next/no-img-element: warn

## Prettier
- semi: true
- singleQuote: true
- trailingComma: es5
- printWidth: 100
- tabWidth: 2
- useTabs: false

## File Extensions
- .ts for TypeScript
- .tsx for React components
- .mts for ES modules

## Naming Conventions
- PascalCase: Components, Types, Interfaces
- camelCase: Variables, Functions
- kebab-case: Files (for modules)
