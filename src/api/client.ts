import { getAuthToken } from '../utils/authToken';
import type { Chat } from './types';

const API_BASE = 'https://api.alephtrade.com';

export interface ValidateTokenUser {
  id: string;
  name?: string;
  second_name?: string;
  patronymic?: string;
  email?: string;
  phone?: string;
}

/**
 * Проверка токена.
 * GET https://api.alephtrade.com/ai/validate_token?token=xxx&user_id=xxx
 * Ответ: { "valid": { "status": true|false, "message": { id, name, ... } } }
 */
export async function validateToken(
  token: string,
  chatUserId?: string
): Promise<ValidateTokenUser | null> {
  const url = new URL(`${API_BASE}/ai/validate_token`);
  url.searchParams.set('token', token);
  if (chatUserId) {
    url.searchParams.set('user_id', chatUserId);
  }
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) return null;
  const raw = (await res.json()) as {
    valid?: { status?: boolean; message?: ValidateTokenUser };
  };
  if (raw?.valid?.status !== true || !raw.valid.message) return null;
  return raw.valid.message;
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getAuthHeadersOnly(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Список чатов пользователя.
 * GET https://api.alephtrade.com/ai/chats/{userId}
 * Ответ: { "chats": [ { "dialog_id", "dialog_type", "created_at", "create_source" }, ... ] }
 */
export async function fetchChats(userId: string): Promise<Chat[]> {
  const res = await fetch(`${API_BASE}/ai/chats/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Ошибка загрузки чатов: ${res.status}`);
  }
  const raw = (await res.json()) as {
    chats?: Array<{ dialog_id: string; dialog_type: string; created_at: string; create_source: string; topic?: string | null }>;
  };
  const data = raw?.chats ?? [];
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => ({
    id: item.dialog_id,
    title: item.topic?.trim() || 'Новый чат',
    created_at: item.created_at,
    updated_at: item.created_at,
    create_source: item.create_source,
    dialog_type: item.dialog_type,
  }));
}

/**
 * История переписки в диалоге.
 * GET https://api.alephtrade.com/ai/chat/{dialog_id}/history
 * Ответ: { "history": [ { role, content? | text? | message? }, ... ] }
 */
export interface HistoryMessage {
  id: string;
  user: boolean;
  text: string;
  /** URL изображений из s3_url.images (история с картинками) */
  imageUrls?: string[];
}

function extractImageUrls(item: {
  s3_url?: {
    images?: Array<{ url?: string }>;
  };
}): string[] | undefined {
  const imgs = item.s3_url?.images;
  if (!Array.isArray(imgs) || imgs.length === 0) return undefined;
  const urls = imgs.map((img) => img.url).filter((u): u is string => Boolean(u));
  return urls.length ? urls : undefined;
}

export async function fetchChatHistory(
  dialogId: string,
  userId?: string
): Promise<HistoryMessage[]> {
  const url = new URL(`${API_BASE}/ai/chat/${dialogId}/history`);
  if (userId) {
    url.searchParams.set('user_id', userId);
  }
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Ошибка загрузки истории: ${res.status}`);
  }
  const raw = (await res.json()) as {
    history?: Array<{
      id?: string;
      role?: string;
      output_text?: string;
      content?: string;
      text?: string;
      message?: string;
      s3_url?: { images?: Array<{ url?: string }> };
    }>;
  };
  const data = raw?.history ?? [];
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item, i) => {
    const role = String(item.role ?? '').toLowerCase();
    const text = String(item.output_text ?? item.content ?? item.text ?? item.message ?? '');
    const isUser = role === 'user' || role === 'human';
    const imageUrls = extractImageUrls(item);
    return {
      id: String(item.id ?? `h-${dialogId}-${i}`),
      user: isUser,
      text,
      imageUrls,
    };
  });
}

/**
 * Создать новый чат.
 * POST https://api.alephtrade.com/ai/chat?user_id={userId}
 * Ответ: { dialog_id, topic, ... }
 */
export async function createChat(userId: string): Promise<string> {
  const url = `${API_BASE}/ai/chat?user_id=${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Ошибка создания чата: ${res.status}`);
  }
  const raw = (await res.json()) as {
    chat_guid?: string;
    dialog_id?: string;
    id?: string;
    data?: { chat_guid?: string; dialog_id?: string; id?: string };
  };
  const id = raw?.chat_guid ?? raw?.dialog_id ?? raw?.id ?? raw?.data?.chat_guid ?? raw?.data?.dialog_id ?? raw?.data?.id;
  if (!id) {
    throw new Error('Некорректный ответ сервера: нет id чата');
  }
  return String(id);
}

export interface StreamMessageOptions {
  /** ID диалога (chat_guid) — сообщение попадёт в этот чат */
  dialog_id?: string;
  /** Файлы изображений для загрузки */
  files?: File[];
}

/**
 * Отправить сообщение и получить стрим ответа (по кускам текста).
 * Form: text, dialog_id, dialog_type, files (опционально)
 */
export async function* streamChatMessage(
  chatId: string,
  text: string,
  options: StreamMessageOptions = {}
): AsyncGenerator<string> {
  const form = new FormData();
  form.append('text', text || ' ');
  form.append('dialog_type', 'general');
  if (options.dialog_id) {
    form.append('dialog_id', options.dialog_id);
  }
  if (options.files?.length) {
    options.files.forEach((file) => form.append('files', file, file.name || 'image.png'));
  }

  const res = await fetch(`${API_BASE}/stream/ai/chat/${chatId}/message`, {
    method: 'POST',
    headers: getAuthHeadersOnly(),
    body: form,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Ошибка отправки: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}
