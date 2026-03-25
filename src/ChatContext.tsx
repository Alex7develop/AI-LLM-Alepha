import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createChat } from './api/client';
import { getOrCreateChatUserId } from './utils/chatUserId';
import { getStoredChatId, setStoredChatId } from './utils/currentChatStorage';
import { useAuthContext } from './AuthContext';

type ChatContextValue = {
  chatUserId: string;
  effectiveUserId: string;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: (options?: { skipSetCurrent?: boolean }) => Promise<string>;
  creatingChat: boolean;
  chatListRefreshTrigger: number;
  refreshChatList: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuthContext();
  const [chatUserId] = useState(() => getOrCreateChatUserId());
  const effectiveUserId = userId ?? chatUserId;
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(() => getStoredChatId());
  const [creatingChat, setCreatingChat] = useState(false);
  const [chatListRefreshTrigger, setChatListRefreshTrigger] = useState(0);

  const setCurrentChatId = useCallback((id: string | null) => {
    setCurrentChatIdState(id);
    setStoredChatId(id);
  }, []);

  useEffect(() => {
    setStoredChatId(currentChatId);
  }, [currentChatId]);

  const createNewChat = useCallback(async (options?: { skipSetCurrent?: boolean }): Promise<string> => {
    setCreatingChat(true);
    try {
      const id = await createChat(effectiveUserId);
      if (!options?.skipSetCurrent) {
        setCurrentChatIdState(id);
      }
      setChatListRefreshTrigger((v) => v + 1);
      return id;
    } finally {
      setCreatingChat(false);
    }
  }, [effectiveUserId]);

  const refreshChatList = useCallback(() => {
    setChatListRefreshTrigger((v) => v + 1);
  }, []);

  const value: ChatContextValue = {
    chatUserId,
    effectiveUserId,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    creatingChat,
    chatListRefreshTrigger,
    refreshChatList,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
};
