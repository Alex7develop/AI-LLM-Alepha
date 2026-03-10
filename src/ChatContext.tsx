import React, { createContext, useCallback, useContext, useState } from 'react';
import { createChat } from './api/client';

type ChatContextValue = {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => Promise<string>;
  creatingChat: boolean;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);

  const setCurrentChatId = useCallback((id: string | null) => {
    setCurrentChatIdState(id);
  }, []);

  const createNewChat = useCallback(async (): Promise<string> => {
    setCreatingChat(true);
    try {
      const id = await createChat();
      setCurrentChatIdState(id);
      return id;
    } finally {
      setCreatingChat(false);
    }
  }, []);

  const value: ChatContextValue = {
    currentChatId,
    setCurrentChatId,
    createNewChat,
    creatingChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = (): ChatContextValue => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
};
