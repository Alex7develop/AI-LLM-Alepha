import React from 'react';
import styled from 'styled-components';
import { FiPaperclip } from 'react-icons/fi';

const Button = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 25px;
  border-radius: 7px;
  color: #143488;
  padding: 0 6px;
  transition: background 0.13s;
  &:hover {
    background: #e8ecfa;
  }
`;
const HiddenInput = styled.input`
  display: none;
`;

export const AttachFileButton: React.FC<{onChange?:(e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ onChange }) => (
  <Button title="Прикрепить файл">
    <FiPaperclip />
    <HiddenInput type="file" onChange={onChange} />
  </Button>
);

