import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiMenu } from 'react-icons/fi';
import { AuthIcon } from './AuthIcon';
import { AttachFileButton } from './AttachFileButton';
import { VoiceButton } from './VoiceButton';
import { useLayout } from './LayoutContext';
import { useAuthContext } from './AuthContext';
import { useChatContext } from './ChatContext';
import { streamChatMessage, fetchChatHistory } from './api/client';

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
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const MarkdownContent = styled.div<{ $user?: boolean }>`
  & p {
    margin: 0 0 0.75em 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  & ul, & ol {
    margin: 0.5em 0;
    padding-left: 1.25em;
  }
  & li {
    margin-bottom: 0.35em;
  }
  & strong {
    font-weight: 600;
  }
  & a {
    color: ${(p) => (p.$user ? '#93c5fd' : '#2563eb')};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  & code {
    background: ${(p) => (p.$user ? 'rgba(255,255,255,0.15)' : '#f1f5f9')};
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }
  & pre {
    margin: 0.5em 0;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    background: ${(p) => (p.$user ? 'rgba(255,255,255,0.1)' : '#f8fafc')};
  }
  & pre code {
    background: none;
    padding: 0;
  }
`;

const UserMessageImage = styled.img`
  max-width: 100%;
  max-height: 280px;
  border-radius: 8px;
  object-fit: contain;
`;
const HistoryMessageImage = styled.img`
  max-width: 100%;
  max-height: 280px;
  border-radius: 8px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
`;

function getMessageImageUrls(msg: ChatMessage): string[] {
  if (msg.imageUrls?.length) return msg.imageUrls;
  if (msg.imageUrl) return [msg.imageUrl];
  return [];
}
const AttachedPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
`;
const AttachedPreviewImg = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
`;
const RemoveAttachBtn = styled.button`
  margin-left: 4px;
  padding: 2px 6px;
  font-size: 12px;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    color: #0f172a;
    background: #e2e8f0;
  }
`;

const InputBarWrapper = styled.div`
  background: #fff;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
`;
const InputBar = styled.form`
  display: flex;
  padding: 10px 14px 14px;
  gap: 8px;
  align-items: center;
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
  /** Локальное превью при отправке (blob URL) */
  imageUrl?: string;
  /** Несколько URL из истории (s3_url.images) или несколько вложений */
  imageUrls?: string[];
}

export const ChatUI: React.FC = () => {
  const { sidebarOpen, openSidebar } = useLayout();
  const { currentChatId, effectiveUserId, createNewChat, refreshChatList, setCurrentChatId } = useChatContext();
  const { userId } = useAuthContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreviewUrl, setAttachedPreviewUrl] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (attachedFile) {
      const url = URL.createObjectURL(attachedFile);
      setAttachedPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setAttachedPreviewUrl(null);
      };
    } else {
      setAttachedPreviewUrl(null);
    }
  }, [attachedFile]);
  const [sendError, setSendError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const skipNextHistoryLoadRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = document.getElementById('chat-body');
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!currentChatId) return;
    if (skipNextHistoryLoadRef.current) {
      skipNextHistoryLoadRef.current = false;
      return;
    }
    setSendError(null);
    setMessages([]);
    setHistoryLoading(true);
    fetchChatHistory(currentChatId, userId ?? undefined)
      .then((history) => setMessages(history))
      .catch((err) => {
        setMessages([]);
        setSendError(err instanceof Error ? err.message : 'Ошибка загрузки истории');
      })
      .finally(() => setHistoryLoading(false));
  }, [currentChatId, userId]);

  const handleAttachChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSendError('Можно прикреплять только изображения');
      return;
    }
    setAttachedFile(file);
    setSendError(null);
    e.target.value = '';
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if ((!text && !attachedFile) || streaming) return;

      let dialogId = currentChatId;
      const isNewChat = !dialogId;
      if (!dialogId) {
        try {
          dialogId = await createNewChat({ skipSetCurrent: true });
        } catch (err) {
          setSendError(err instanceof Error ? err.message : 'Не удалось создать чат');
          return;
        }
      }

      const fileToSend = attachedFile;
      setInput('');
      setAttachedFile(null);
      setSendError(null);

      const imageUrl = fileToSend ? URL.createObjectURL(fileToSend) : undefined;
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        user: true,
        text: text || '(Изображение)',
        imageUrl,
      };
      setMessages((prev) => [...prev, userMsg]);
      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, user: false, text: '' }]);
      setStreaming(true);

      try {
        let full = '';
        for await (const chunk of streamChatMessage(effectiveUserId, text || ' ', {
          dialog_id: dialogId,
          files: fileToSend ? [fileToSend] : undefined,
        })) {
          full += chunk;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: full } : m))
          );
        }
        if (isNewChat) {
          skipNextHistoryLoadRef.current = true;
          setCurrentChatId(dialogId);
        }
        refreshChatList();
      } catch (err) {
        setSendError(err instanceof Error ? err.message : 'Ошибка отправки');
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: '(Ошибка получения ответа)' } : m))
        );
      } finally {
        setStreaming(false);
      }
    },
    [input, attachedFile, streaming, currentChatId, effectiveUserId, createNewChat, refreshChatList, setCurrentChatId]
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
        {historyLoading && (
          <Bubble user={false} style={{ alignSelf: 'center', color: '#64748b' }}>
            Загрузка истории…
          </Bubble>
        )}
        {!historyLoading && messages.length === 0 && !sendError && (
          <Bubble user={false} style={{ alignSelf: 'center', color: '#64748b' }}>
            {currentChatId ? 'Нет сообщений в этом чате.' : 'Напишите сообщение или выберите чат слева.'}
          </Bubble>
        )}
        {sendError && (
          <Bubble user={false} style={{ borderColor: '#f87171', color: '#b91c1c' }}>
            {sendError}
          </Bubble>
        )}
        {messages.map((msg) => {
          const imgs = getMessageImageUrls(msg);
          return (
            <Bubble key={msg.id} user={msg.user}>
              {msg.user ? (
                <>
                  {imgs.map((url) => (
                    <UserMessageImage key={url} src={url} alt="" />
                  ))}
                  {msg.text}
                </>
              ) : (
                <>
                  {imgs.map((url) => (
                    <HistoryMessageImage key={url} src={url} alt="" loading="lazy" />
                  ))}
                  <MarkdownContent $user={false}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.text || '…'}
                    </ReactMarkdown>
                  </MarkdownContent>
                </>
              )}
            </Bubble>
          );
        })}
      </ChatBody>
      <InputBarWrapper>
        {attachedFile && (
          <AttachedPreview style={{ margin: '10px 14px 0' }}>
            <AttachedPreviewImg src={attachedPreviewUrl || ''} alt="" />
            <span>{attachedFile.name}</span>
            <RemoveAttachBtn type="button" onClick={() => setAttachedFile(null)}>
              ✕
            </RemoveAttachBtn>
          </AttachedPreview>
        )}
        <InputBar onSubmit={handleSubmit}>
          <AttachFileButton onChange={handleAttachChange} />
          <Input
            placeholder="Напишите вопрос..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={streaming}
          />
          <VoiceButton disabled={streaming} />
          <SendBtn type="submit" disabled={streaming || (!input.trim() && !attachedFile)}>
            Отправить
          </SendBtn>
        </InputBar>
      </InputBarWrapper>
    </Wrapper>
  );
};

