const API_BASE = 'https://api.alephtrade.com';

/** ID чата для начала нового диалога (POST stream/ai/chat/{id}/message). */
export const DEFAULT_CHAT_ID = '895169887';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getAuthHeadersOnly(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

import type { Chat } from './types';

/**
 * Список чатов пользователя.
 * GET https://api.alephtrade.com/ai/chats/{userId}
 * Ответ: { "chats": [ { "dialog_id", "dialog_type", "created_at", "create_source" }, ... ] }
 */
export async function fetchChats(userId: string = DEFAULT_CHAT_ID): Promise<Chat[]> {
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
  return data.map((item, index) => ({
    id: item.dialog_id,
    title: item.topic?.trim() || formatChatTitle(item.created_at, item.create_source, index),
    created_at: item.created_at,
    updated_at: item.created_at,
    create_source: item.create_source,
    dialog_type: item.dialog_type,
  }));
}

function formatChatTitle(createdAt: string | undefined, createSource: string | undefined, fallbackIndex: number): string {
  let dateStr: string;
  if (!createdAt) {
    dateStr = `Диалог ${fallbackIndex + 1}`;
  } else {
    try {
      dateStr = new Date(createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      dateStr = `Диалог ${fallbackIndex + 1}`;
    }
  }
  if (createSource) {
    return `${dateStr} · ${createSource}`;
  }
  return dateStr;
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
}

export async function fetchChatHistory(dialogId: string): Promise<HistoryMessage[]> {
  const res = await fetch(`${API_BASE}/ai/chat/${dialogId}/history`, {
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
    return {
      id: String(item.id ?? `h-${dialogId}-${i}`),
      user: isUser,
      text,
    };
  });
}

/** Создать новый чат. Возвращает id созданного чата. */
export async function createChat(): Promise<string> {
  const res = await fetch(`${API_BASE}/ai/chats`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error(`Ошибка создания чата: ${res.status}`);
  }
  const raw = await res.json();
  const id = raw?.id ?? raw?.data?.id;
  if (!id) {
    throw new Error('Некорректный ответ сервера: нет id чата');
  }
  return String(id);
}

export interface StreamMessageOptions {
  dialog_type?: string;
  source_name?: string;
}

/**
 * Отправить сообщение и получить стрим ответа (по кускам текста).
 * Эквивалент curl:
 *   curl -i -N -X POST 'https://api.alephtrade.com/stream/ai/chat/{chatId}/message' \
 *     --form 'text="..."' --form 'dialog_type="general"' --form 'source_name="web"'
 */
export async function* streamChatMessage(
  chatId: string,
  text: string,
  options: StreamMessageOptions = {}
): AsyncGenerator<string> {
  const form = new FormData();
  form.append('text', text);
  form.append('dialog_type', options.dialog_type ?? 'general');
  form.append('source_name', options.source_name ?? 'web');

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
