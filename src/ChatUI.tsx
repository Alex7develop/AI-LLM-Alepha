import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';
import { AuthIcon } from './AuthIcon';
import { AttachFileButton } from './AttachFileButton';
import { useLayout } from './LayoutContext';
import { useChatContext } from './ChatContext';
import { streamChatMessage, DEFAULT_CHAT_ID } from './api/client';

const Wrapper = styled.div`
  min-height: 100%;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-width: 0;
  box-shadow: -1px 0 0 0 #e2e8f0;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 8px;
  height: 44px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
`;

const MenuBtn = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;
  min-height: 0;
  @media (max-width: 600px) {
    padding: 12px 14px;
  }
`;

const Bubble = styled.div<{ user?: boolean }>`
  align-self: ${(p) => (p.user ? 'flex-end' : 'flex-start')};
  background: ${(p) => (p.user ? '#0f172a' : '#ffffff')};
  color: ${(p) => (p.user ? '#f1f5f9' : '#334155')};
  border-radius: 12px;
  padding: 10px 14px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.45;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: ${(p) => (p.user ? 'none' : '1px solid #e2e8f0')};
  @media (max-width: 600px) {
    max-width: 92%;
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const InputBar = styled.form`
  display: flex;
  padding: 10px 14px 14px;
  gap: 8px;
  align-items: center;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
  @media (max-width: 600px) {
    padding: 8px 10px 16px;
  }
`;
const Input = styled.input`
  flex: 1;
  background: #f8fafc;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  font-family: inherit;
  min-width: 80px;
  min-height: 40px;
  color: #334155;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.06);
  }
  @media (max-width: 600px) {
    min-height: 36px;
    font-size: 16px;
  }
`;
const SendBtn = styled.button`
  background: #0f172a;
  color: #fff;
  padding: 0 14px;
  font-size: 13px;
  height: 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, transform 0.1s;
  flex-shrink: 0;
  &:hover {
    background: #1e293b;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export interface ChatMessage {
  id: string;
  user: boolean;
  text: string;
}

export const ChatUI: React.FC = () => {
  const { sidebarOpen, openSidebar } = useLayout();
  const { currentChatId } = useChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = document.getElementById('chat-body');
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    setMessages([]);
    setSendError(null);
  }, [currentChatId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || streaming) return;

      const chatId = currentChatId ?? DEFAULT_CHAT_ID;

      setInput('');
      setSendError(null);
      const userMsg: ChatMessage = { id: `u-${Date.now()}`, user: true, text };
      setMessages((prev) => [...prev, userMsg]);
      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, user: false, text: '' }]);
      setStreaming(true);

      try {
        let full = '';
        for await (const chunk of streamChatMessage(chatId, text, { dialog_type: 'general', source_name: 'web' })) {
          full += chunk;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: full } : m))
          );
        }
      } catch (err) {
        setSendError(err instanceof Error ? err.message : 'Ошибка отправки');
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: '(Ошибка получения ответа)' } : m))
        );
      } finally {
        setStreaming(false);
      }
    },
    [input, streaming, currentChatId]
  );

  return (
    <Wrapper>
      <ChatHeader>
        {!sidebarOpen ? (
          <MenuBtn onClick={openSidebar} title="История чатов">
            <FiMenu size={18} />
          </MenuBtn>
        ) : (
          <div />
        )}
        <AuthIcon />
      </ChatHeader>
      <ChatBody id="chat-body">
        {messages.length === 0 && !sendError && (
          <Bubble user={false} style={{ alignSelf: 'center', color: '#64748b' }}>
            Напишите сообщение или выберите чат слева.
          </Bubble>
        )}
        {sendError && (
          <Bubble user={false} style={{ borderColor: '#f87171', color: '#b91c1c' }}>
            {sendError}
          </Bubble>
        )}
        {messages.map((msg) => (
          <Bubble key={msg.id} user={msg.user}>
            {msg.text || (msg.user ? '' : '…')}
          </Bubble>
        ))}
      </ChatBody>
      <InputBar onSubmit={handleSubmit}>
        <AttachFileButton />
        <Input
          placeholder="Напишите вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
        />
        <SendBtn type="submit" disabled={streaming || !input.trim()}>
          Отправить
        </SendBtn>
      </InputBar>
    </Wrapper>
  );
};

