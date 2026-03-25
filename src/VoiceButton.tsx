import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 6px 8px;
  transition: background 0.15s, opacity 0.15s;
  flex-shrink: 0;
  &:hover {
    background: #f1f5f9;
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const IconImg = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

export const VoiceButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <Button type="button" title="Голосовой ввод" disabled={disabled}>
    <IconImg src="/voice.png" alt="" />
  </Button>
);
