import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUser } from 'react-icons/fi';
import { useAuthContext } from './AuthContext';

const IconBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
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
const LetterBadge = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DropdownOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 400;
`;
const DropdownBox = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: auto;
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  min-width: min(260px, calc(100vw - 24px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)));
  max-width: min(320px, calc(100vw - 16px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)));
  box-sizing: border-box;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 401;
  overflow-wrap: anywhere;
  word-break: break-word;
`;
const DropdownName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
`;
const DropdownRow = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;
const DropdownValue = styled.span`
  color: #334155;
  margin-left: 6px;
`;
const DropdownDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 12px 0;
`;
const LogoutBtn = styled.button`
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

export const AuthIcon: React.FC = () => {
  const { isAuthorized, userName, userData } = useAuthContext();
  const [open, setOpen] = useState(false);
  const firstLetter = userName?.trim().charAt(0) ?? null;

  const handleClick = () => {
    if (isAuthorized && firstLetter) {
      setOpen((v) => !v);
    } else {
      const returnUrl = encodeURIComponent(window.location.origin + window.location.pathname);
      window.location.href = `https://oauth.alephtrade.com/?redirect_uri=${returnUrl}`;
    }
  };

  const handleLogout = () => {
    setOpen(false);
    // TODO: подключить метод выхода
  };

  const fullName = userData
    ? [userData.second_name, userData.name, userData.patronymic].filter(Boolean).join(' ')
    : '';

  return (
    <Wrapper>
      <IconBtn
        title={isAuthorized && userName ? userName : 'Войти через Alephtrade'}
        onClick={handleClick}
      >
        {isAuthorized && firstLetter ? (
          <LetterBadge>{firstLetter}</LetterBadge>
        ) : (
          <IconWrap>
            <FiUser size={18} />
          </IconWrap>
        )}
      </IconBtn>
      {open && isAuthorized && (
        <>
          <DropdownOverlay onClick={() => setOpen(false)} />
          <DropdownBox>
            <DropdownName>{fullName || '—'}</DropdownName>
            <DropdownRow>
              Телефон
              <DropdownValue>{userData?.phone || '—'}</DropdownValue>
            </DropdownRow>
            <DropdownRow>
              Почта
              <DropdownValue>{userData?.email || '—'}</DropdownValue>
            </DropdownRow>
            <DropdownDivider />
            <LogoutBtn type="button" onClick={handleLogout}>
              Выход
            </LogoutBtn>
          </DropdownBox>
        </>
      )}
    </Wrapper>
  );
};

