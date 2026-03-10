import { useState, useEffect, useCallback } from 'react';
import { fetchChats } from '../api/client';
import type { Chat } from '../api/types';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchChats();
      setChats(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить чаты');
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { chats, loading, error, reload: load };
}
