# Architecture

## Core Patterns
- CRUD operations via @/core/index
- Query Engine for filtering/sorting
- Event System for pub/sub
- Sync Queue for data synchronization

## Database (Dexie.js)
```typescript
import { db } from '@/core/database';
const entities = await db.entities.where('user_id').equals(userId).toArray();
```

## Query Engine
```typescript
import { query } from '@/core';
const result = await query<Entity>('entities')
  .userId(USER_ID)
  .where('type', 'eq', 'value')
  .orderBy('date', 'desc')
  .take(10)
  .execute();
```

## Event System
```typescript
import { emit, on } from '@/core/events';
emit('entity.created', payload);
on('entity.created', handler);
```

## UI Components
- Radix UI primitives
- Custom components in @/ui/components
- AppLayout wrapper for pages
