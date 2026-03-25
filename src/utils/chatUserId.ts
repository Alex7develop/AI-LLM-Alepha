const COOKIE_NAME = 'alephtrade_chat_id';
const COOKIE_MAX_AGE_DAYS = 365;

/** Генерирует 32-символьный код (hex). */
export function generateChatUserId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Получить chat ID из cookie. Возвращает null, если нет. */
export function getChatUserIdFromCookie(): string | null {
  const value = getCookie(COOKIE_NAME);
  if (!value || value.length !== 32) return null;
  return value;
}

/** Сохранить chat ID в cookie. */
export function setChatUserIdCookie(userId: string): void {
  setCookie(COOKIE_NAME, userId);
}

/** Получить или создать 32-символьный chat ID. При первом заходе генерирует и сохраняет в cookie. */
export function getOrCreateChatUserId(): string {
  let userId = getChatUserIdFromCookie();
  if (!userId) {
    userId = generateChatUserId();
    setChatUserIdCookie(userId);
  }
  return userId;
}
