import React from 'react';
import styled from 'styled-components';

const Button = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 6px 8px;
  transition: background 0.15s, opacity 0.15s;
  flex-shrink: 0;
  &:hover {
    background: #f1f5f9;
    opacity: 0.85;
  }
`;
const IconImg = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
const HiddenInput = styled.input`
  display: none;
`;

export const AttachFileButton: React.FC<{ onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
  onChange,
}) => (
  <Button title="Прикрепить изображение">
    <IconImg src="/img.png" alt="" />
    <HiddenInput type="file" onChange={onChange} accept="image/*" />
  </Button>
);

