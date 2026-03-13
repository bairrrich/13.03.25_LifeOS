/**
 * Генерация уникальных ID для offline-first приложения
 * Используем ulid-like подход для sortable ID
 */

/**
 * Генерирует уникальный ID в формате ulid (Crockford base32)
 * Формат: timestamp(48 бит) + random(80 бит) = 26 символов
 */
export function generateId(): string {
  const now = Date.now();
  
  // Timestamp часть (48 бит, 10 символов в base32)
  const timestamp = toBase32(now);
  
  // Random часть (80 бит, 16 символов в base32)
  const random = generateRandom(10);
  
  return timestamp + random;
}

const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function toBase32(num: number): string {
  let result = '';
  let n = num;
  
  for (let i = 0; i < 10; i++) {
    result = CROCKFORD_BASE32[n % 32] + result;
    n = Math.floor(n / 32);
  }
  
  return result.padStart(10, '0');
}

function generateRandom(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CROCKFORD_BASE32[bytes[i] % 32];
  }
  
  return result;
}

/**
 * Проверяет валидность ID
 */
export function isValidId(id: string): boolean {
  return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(id);
}

/**
 * Извлекает timestamp из ID
 */
export function getIdTimestamp(id: string): number {
  const timestampPart = id.slice(0, 10);
  let timestamp = 0;
  
  for (let i = 0; i < timestampPart.length; i++) {
    const char = timestampPart[i];
    const value = CROCKFORD_BASE32.indexOf(char);
    timestamp = timestamp * 32 + value;
  }
  
  return timestamp;
}
