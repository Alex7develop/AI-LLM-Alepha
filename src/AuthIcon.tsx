import React from 'react';
import styled from 'styled-components';
import { FiUser } from 'react-icons/fi';

const IconBtn = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px;
  align-items: center;
  border-radius: 50%;
  transition: background 0.16s;
  &:hover {
    background: #e4eaff;
  }
`;
const IconWrap = styled.span`
  color: #153585;
  font-size: 28px;
  display: flex;
`;

export const AuthIcon: React.FC = () => (
  <IconBtn
    title="Войти через Alephtrade"
    onClick={() => window.open('https://oauth.alephtrade.com/', '_blank')}
  >
    <IconWrap>
      <FiUser />
    </IconWrap>
  </IconBtn>
);

