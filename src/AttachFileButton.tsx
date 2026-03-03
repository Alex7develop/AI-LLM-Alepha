import React from 'react';
import styled from 'styled-components';
import { FiPaperclip } from 'react-icons/fi';

const Button = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 8px;
  color: #64748b;
  padding: 6px 8px;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;
const HiddenInput = styled.input`
  display: none;
`;

export const AttachFileButton: React.FC<{onChange?:(e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ onChange }) => (
  <Button title="Прикрепить файл">
    <FiPaperclip size={18} />
    <HiddenInput type="file" onChange={onChange} />
  </Button>
);

