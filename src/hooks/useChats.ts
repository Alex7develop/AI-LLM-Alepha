import { useState, useEffect, useCallback } from 'react';
import { fetchChats } from '../api/client';
import type { Chat } from '../api/types';
import { useAuthContext } from '../AuthContext';
import { useChatContext } from '../ChatContext';

export function useChats() {
  const { chatUserId, chatListRefreshTrigger } = useChatContext();
  const { authValidatedTrigger, userId } = useAuthContext();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveUserId = userId ?? chatUserId;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchChats(effectiveUserId);
      const sorted = [...list].sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      });
      setChats(sorted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить чаты');
      setChats([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    load();
  }, [load, chatListRefreshTrigger, authValidatedTrigger]);

  return { chats, loading, error, reload: load };
}
