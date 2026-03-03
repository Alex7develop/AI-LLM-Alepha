import React from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';
import { AuthIcon } from './AuthIcon';
import { AttachFileButton } from './AttachFileButton';
import { useLayout } from './LayoutContext';

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

const mockMessages = [
  { user: false, text: 'Здравствуйте! Чем я могу помочь Дмитрий Дударев?' },
  { user: true, text: 'Какие свойства у товара с id ... ?' },
  { user: false, text: 'Вот информация о товаре ...' },
  { user: true, text: 'Багодарю!' },
  { user: false, text: 'Как подключиться к удаленному столу?' },
];

export const ChatUI: React.FC = () => {
  const { sidebarOpen, openSidebar } = useLayout();

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
      <ChatBody>
        {mockMessages.map((msg, i) => (
          <Bubble key={i} user={msg.user}>{msg.text}</Bubble>
        ))}
      </ChatBody>
      <InputBar>
        <AttachFileButton />
        <Input placeholder="Напишите вопрос..." disabled />
        <SendBtn disabled>Отправить</SendBtn>
      </InputBar>
    </Wrapper>
  );
};

