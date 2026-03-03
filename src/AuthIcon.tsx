import React from 'react';
import styled from 'styled-components';
import { FiUser } from 'react-icons/fi';

const IconBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.15s;
  &:hover {
    background: #f1f5f9;
  }
  &:hover span {
    color: #0f172a;
  }
`;
const IconWrap = styled.span`
  color: #64748b;
  font-size: 18px;
  display: flex;
  transition: color 0.15s;
`;

export const AuthIcon: React.FC = () => (
  <IconBtn
    title="Войти через Alephtrade"
    onClick={() => window.open('https://oauth.alephtrade.com/', '_blank')}
  >
    <IconWrap>
      <FiUser size={18} />
    </IconWrap>
  </IconBtn>
);

