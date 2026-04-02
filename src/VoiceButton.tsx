import React from 'react';
import styled from 'styled-components';

const Button = styled.button<{ $recording?: boolean; $busy?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  background: ${(p) => (p.$recording ? 'rgba(239, 68, 68, 0.15)' : 'transparent')};
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 6px 8px;
  transition: background 0.15s, opacity 0.15s;
  flex-shrink: 0;
  &:hover:not(:disabled) {
    background: ${(p) => (p.$recording ? 'rgba(239, 68, 68, 0.22)' : '#f1f5f9')};
    opacity: ${(p) => (p.$busy ? 0.6 : 0.85)};
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

export const VoiceButton: React.FC<{
  disabled?: boolean;
  recording?: boolean;
  busy?: boolean;
  onClick?: () => void;
}> = ({ disabled, recording, busy, onClick }) => (
  <Button
    type="button"
    title={recording ? 'Нажмите, чтобы остановить и отправить' : 'Голосовой ввод'}
    disabled={disabled || busy}
    $recording={recording}
    $busy={busy}
    onClick={onClick}
  >
    <IconImg src="/voice.png" alt="" />
  </Button>
);
