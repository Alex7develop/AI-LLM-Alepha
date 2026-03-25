const TOKEN_COOKIE_NAME = 'token';
const TOKEN_COOKIE_MAX_AGE_DAYS = 30;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  const maxAge = TOKEN_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Получить токен авторизации: сначала из cookie "token", затем из localStorage.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie(TOKEN_COOKIE_NAME) || localStorage.getItem('token');
}

/**
 * Сохранить токен в cookie (при возврате с devoauth).
 */
export function setAuthToken(token: string): void {
  setCookie(TOKEN_COOKIE_NAME, token);
  localStorage.setItem('token', token);
}

/**
 * Извлечь токен из URL (?token=xxx) при возврате с devoauth.
 */
export function getTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

/**
 * Удалить token из query и обновить URL без перезагрузки.
 */
export function clearTokenFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('token');
  window.history.replaceState({}, '', url.toString());
}
