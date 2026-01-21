import React from 'react';
import styled from 'styled-components';
import { AuthIcon } from './AuthIcon';
import { AttachFileButton } from './AttachFileButton';
import logo from './assets/big_logo.png';

const BG_COLOR = '#143488';

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${BG_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 430px;
  background: #fff;
  box-shadow: 0 8px 40px rgba(20,52,136,0.11);
  border-radius: 22px;
  padding: 0 0 96px 0;
  min-height: 580px;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
  @media (max-width: 600px) {
    max-width: 100vw;
    min-height: 100vh;
    border-radius: 0;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  height: 64px;
  border-bottom: 1px solid #e3eefd;
`;

const Logo = styled.img`
  height: 37px;
  @media (max-width: 600px) {
    height: 29px;
  }
`;
const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Bubble = styled.div<{user?: boolean}>`
  align-self: ${p => (p.user ? 'flex-end' : 'flex-start')};
  background: ${p => (p.user ? '#e3eefd' : '#f7fafc')};
  color: #1a2340;
  border-radius: 18px;
  padding: 13px 18px;
  max-width: 85%;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(44,74,160,0.03);
  margin-bottom: 2px;
`;

const InputBar = styled.form`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f5f8ff;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  border-top: 1px solid #e3eefd;
  display: flex;
  padding: 16px 14px;
  gap: 8px;
  align-items: end;
  box-sizing: border-box;
  @media (max-width: 600px) {
    border-radius: 0;
    padding-bottom: 36px;
  }
`;
const Input = styled.input`
  flex: 1;
  background: #fff;
  padding: 10px 16px;
  font-size: 17px;
  border: 1.5px solid #e3eefd;
  border-radius: 10px;
  outline: none;
  font-family: inherit;
`;
const SendBtn = styled.button`
  background: ${BG_COLOR};
  color: #fff;
  padding: 0 18px;
  font-size: 15px;
  height: 40px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.18s;
  &:hover {background: #1747c3;}
`;

// Пока это просто мокап сообщений
const mockMessages = [
  {user: false, text: 'Здравствуйте! Чем я могу помочь?'},
  {user: true, text: 'Какие свойства у товара с id ... ?'},
  {user: false, text: 'Вот информация о товаре ...'},
];

export const ChatUI: React.FC = () => {
  return (
    <Wrapper>
      <ChatContainer>
        <ChatHeader>
          <Logo src={logo} alt="Alephtrade" />
          <AuthIcon />
        </ChatHeader>
        <ChatBody>
          {mockMessages.map((msg, i) => (
            <Bubble key={i} user={msg.user}>{msg.text}</Bubble>
          ))}
        </ChatBody>
        <InputBar>
          <AttachFileButton />
          <Input placeholder="Напишите вопрос..." disabled style={{marginLeft:4}} />
          <SendBtn disabled>Отправить</SendBtn>
        </InputBar>
      </ChatContainer>
    </Wrapper>
  );
};

