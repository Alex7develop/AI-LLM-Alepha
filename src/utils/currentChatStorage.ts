const STORAGE_KEY = 'alephtrade_current_chat_id';

export function getStoredChatId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value && value.trim() ? value : null;
}

export function setStoredChatId(chatId: string | null): void {
  if (typeof localStorage === 'undefined') return;
  if (chatId) {
    localStorage.setItem(STORAGE_KEY, chatId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
