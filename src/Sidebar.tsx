import React from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLayout } from './LayoutContext';
import { useChatContext } from './ChatContext';
import { useChats } from './hooks/useChats';
import logo from './assets/big_logo.png';

const SidebarWrapper = styled.aside<{ $open: boolean }>`
  position: relative;
  width: ${(p) => (p.$open ? '240px' : '40px')};
  min-width: ${(p) => (p.$open ? '240px' : '40px')};
  background: #0f172a;
  color: #e2e8f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0;
  transition: width 0.2s ease, min-width 0.2s ease;
  flex-shrink: 0;
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: ${(p) => (p.$open ? '260px' : '0')};
    min-width: 0;
    overflow: hidden;
    box-shadow: ${(p) => (p.$open ? '4px 0 12px rgba(0,0,0,0.15)' : 'none')};
  }
`;

const ToggleTab = styled.button`
  position: absolute;
  top: 50%;
  right: -14px;
  transform: translateY(-50%);
  width: 26px;
  height: 68px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020617;
  border-radius: 34px;
  border: 1px solid rgba(15, 23, 42, 0.7);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.65);
  color: #e5e7eb;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s, right 0.15s;
  &:hover {
    background: #020617;
    color: #ffffff;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.9);
  }
  @media (max-width: 768px) {
    right: -10px;
    height: 56px;
    width: 24px;
  }
`;

const LogoBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
  overflow: visible;
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
  object-fit: contain;
  filter: brightness(1.05) contrast(1.05);
  transform: scale(2.75);
  transform-origin: center;
`;

const NewChatBtn = styled.button`
  margin: 10px 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #e2e8f0;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.18);
  }
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 6px 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
`;
const ChatListItem = styled.li<{ $active?: boolean }>`
  padding: 8px 12px;
  margin: 0 6px;
  font-size: 13px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(p) => (p.$active ? '#e2e8f0' : '#94a3b8')};
  background: ${(p) => (p.$active ? 'rgba(255, 255, 255, 0.08)' : 'transparent')};
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e2e8f0;
  }
`;

const ChatListEmpty = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  color: #64748b;
  text-align: center;
`;

const ChatListError = styled.div`
  padding: 12px 16px;
  font-size: 12px;
  color: #f87171;
`;
const RetryBtn = styled.button`
  margin-top: 6px;
  padding: 4px 10px;
  font-size: 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  color: #e2e8f0;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.15); }
`;

const ChatListLoading = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
`;

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const { currentChatId, setCurrentChatId, createNewChat, creatingChat } = useChatContext();
  const { chats, loading, error, reload } = useChats();

  const handleNewChat = async () => {
    try {
      await createNewChat();
      reload();
    } catch {
      reload();
    }
  };

  return (
    <SidebarWrapper $open={sidebarOpen}>
      {sidebarOpen && (
        <>
          <LogoBlock>
            <LogoImage src={logo} alt="Алеф Трейд" />
          </LogoBlock>
          <NewChatBtn onClick={handleNewChat} disabled={creatingChat}>
            {creatingChat ? '…' : '+ Новый чат'}
          </NewChatBtn>
          <ChatList>
            {loading && <ChatListLoading>Загрузка...</ChatListLoading>}
            {error && (
              <ChatListError title={error}>
                Ошибка загрузки.
                <RetryBtn type="button" onClick={reload}>Повторить</RetryBtn>
              </ChatListError>
            )}
            {!loading && !error && chats.length === 0 && (
              <ChatListEmpty>Нет чатов</ChatListEmpty>
            )}
            {!loading && !error && chats.length > 0 && chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                $active={currentChatId === chat.id}
                onClick={() => setCurrentChatId(chat.id)}
              >
                {chat.title}
              </ChatListItem>
            ))}
          </ChatList>
        </>
      )}
      <ToggleTab
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Скрыть панель' : 'Показать историю чатов'}
      >
        {sidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
      </ToggleTab>
    </SidebarWrapper>
  );
};

