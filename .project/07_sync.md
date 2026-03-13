Ниже — **архитектура Sync Engine уровня production для LifeOS**.
Это система, которая позволяет приложению работать **offline-first**, синхронизировать данные между устройствами и сервером, а также корректно обрабатывать **конфликты изменений**.

Я разложу её на понятные части.

---

# 1. Основная идея Sync Engine

Любое действие пользователя:

1. сначала записывается **в локальную БД**
2. добавляется **в очередь синхронизации**
3. позже отправляется **на сервер**

```text
UI
 ↓
Local DB (Dexie / SQLite)
 ↓
Sync Queue
 ↓
Sync Engine
 ↓
Server (Supabase / Postgres)
 ↓
Merge
 ↓
Local DB
```

Главный принцип:

```text
Local-first
```

---

# 2. Основные компоненты Sync Engine

```text
sync
│
├ syncQueue
├ changeTracker
├ syncEngine
├ conflictResolver
├ transport
└ mergeEngine
```

---

# 3. Change Tracker

Отслеживает изменения в базе.

Каждая сущность имеет:

```text
version
updated_at
sync_status
```

Пример:

```json
{
"id": "tx1",
"amount": 20,
"version": 2,
"sync_status": "local"
}
```

---

# 4. Sync Status

Каждая запись имеет статус:

```text
local
synced
conflict
deleted
```

Описание:

| статус   | значение                  |
| -------- | ------------------------- |
| local    | изменение только локально |
| synced   | синхронизировано          |
| conflict | конфликт версий           |
| deleted  | soft delete               |

---

# 5. Sync Queue

Очередь изменений.

```text
sync_queue
```

поля:

```text
id
entity_type
entity_id
operation
payload
created_at
status
```

Пример записи:

```json
{
"entity_type": "transaction",
"entity_id": "tx1",
"operation": "update"
}
```

---

# 6. Операции Sync

```text
create
update
delete
```

Пример payload:

```json
{
"id": "tx1",
"amount": 30,
"version": 3
}
```

---

# 7. Sync Engine

Основной процесс синхронизации.

Работает по таймеру.

```text
syncEngine
```

Алгоритм:

```text
1 получить очередь
2 отправить изменения
3 получить изменения сервера
4 merge
5 обновить local db
```

---

# 8. Push Sync

Отправка изменений на сервер.

```text
POST /sync/push
```

payload:

```json
{
"device_id": "device1",
"changes": [
{
"entity": "transaction",
"operation": "update",
"data": { ... }
}
]
}
```

---

# 9. Pull Sync

Получение изменений с сервера.

```text
GET /sync/pull
```

```json
{
"since": 1700000
}
```

Ответ:

```json
{
"changes": [...]
}
```

---

# 10. Versioning

Каждая запись имеет:

```text
version
```

Пример:

```text
v1 → create
v2 → edit
v3 → edit
```

Это помогает обнаруживать конфликты.

---

# 11. Vector Clock (опционально)

Для multi-device.

```text
device_id
version
```

пример:

```json
{
"tx1": {
"deviceA": 3,
"deviceB": 1
}
}
```

---

# 12. Conflict Detection

Конфликт возникает когда:

```text
local_version != server_version
```

пример:

```text
deviceA edit → v2
deviceB edit → v2
```

---

# 13. Conflict Resolver

Возможные стратегии:

### 1 Last Write Wins

```text
updated_at
```

побеждает последний.

---

### 2 Merge fields

например:

```text
tags
notes
```

объединяются.

---

### 3 Manual resolve

показываем пользователю.

---

# 14. Merge Engine

Объединяет данные.

пример:

```text
server version = 3
local version = 2
```

результат:

```text
take server
```

---

# 15. Soft Delete

Удаление не физическое.

```text
deleted_at
```

пример:

```json
{
"id": "tx1",
"deleted_at": 170000
}
```

---

# 16. Incremental Sync

Сервер хранит:

```text
last_sync
```

запрос:

```text
changes since timestamp
```

Это делает sync быстрым.

---

# 17. Device Tracking

Таблица:

```text
devices
```

```text
id
user_id
last_sync
platform
```

---

# 18. Sync Lock

Чтобы не запускать несколько sync.

```text
sync_state
```

```text
is_syncing
last_sync
```

---

# 19. Transport Layer

Отвечает за API.

```text
transport
```

```text
pushChanges()
pullChanges()
```

---

# 20. Пример Sync Flow

```text
user edits transaction
↓
local db update
↓
sync_queue add
↓
sync engine push
↓
server apply
↓
server returns changes
↓
merge
↓
update local db
```

---

# 21. Dexie пример таблицы

```ts
db.version(1).stores({

transactions:
"id, user_id, updated_at",

sync_queue:
"id, entity_type, entity_id",

devices:
"id, user_id"

})
```

---

# 22. Sync Engine пример кода

```ts
async function runSync() {

 const changes = await queue.getPending()

 await pushChanges(changes)

 const serverChanges = await pullChanges()

 await mergeChanges(serverChanges)

 await queue.markSynced(changes)

}
```

---

# 23. Batch Sync

Лучше отправлять пачками.

```text
batch_size = 50
```

---

# 24. Background Sync

Запускается:

```text
app start
interval
network reconnect
manual sync
```

---

# 25. Реальная архитектура Sync

```text
sync
│
├ queue
│
├ engine
│
├ conflict
│
├ transport
│
└ merge
```

---

# 26. Sync Server

API endpoints:

```text
POST /sync/push
GET /sync/pull
GET /sync/status
```

---

# 27. Как делают большие приложения

Так устроены:

* Notion
* Figma
* Linear
* Superhuman

---

# 28. Масштаб Sync

LifeOS может иметь:

```text
100k+ entities
10 devices
offline weeks
```

поэтому sync должен быть надежным.

---

# 29. Оптимизации

важные вещи:

```text
compression
delta sync
batch updates
lazy loading
```

---

# 30. Полная архитектура LifeOS

```text
App
│
├ UI
│
├ Modules
│
├ Entity System
│
├ Local Database
│
├ Sync Engine
│
└ Server
```
