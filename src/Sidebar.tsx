import React from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.aside`
  width: 260px;
  background: #192044;
  color: #FFF;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 1.5px 0 9px rgba(20,52,136,0.03);
  padding: 18px 0 0;
  @media (max-width: 900px) {
    width: 100px;
    min-width: 60px;
    padding: 10px 0 0;
    border-radius: 0;
  }
`;

import logo from './assets/big_logo.png';

const LogoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 20px 21px 25px;
`;

const LogoImage = styled.img`
  height: 39px;
`;

const NewChatBtn = styled.button`
  margin: 0 20px 15px 25px;
  padding: 9px 0px;
  width: 85%;
  border-radius: 13px;
  border: none;
  background: #2862e6;
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  cursor: pointer;
  transition: background .15s;
  &:hover { background: #2e429b; }
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  flex: 1;
  overflow-y: auto;
`;
const ChatListItem = styled.li`
  padding: 11px 26px;
  font-size: 15px;
  border-radius: 7px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: background .11s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover { background: #213083; }
`;

// Для примера — моковые чаты
const dummyChats = [
  'Тестовая сессия',
  'Обсуждение заказов',
  'Генерация спецификации',
  'Тест: перевод',
  'Вопрос по API',
];

export const Sidebar: React.FC = () => (
  <SidebarWrapper>
    <LogoBlock>
      <LogoImage src={logo} alt="logo" />
    </LogoBlock>
    <NewChatBtn>+ Новый чат</NewChatBtn>
    <ChatList>
      {dummyChats.map((title, i) => (
        <ChatListItem key={i}>{title}</ChatListItem>
      ))}
    </ChatList>
  </SidebarWrapper>
);

