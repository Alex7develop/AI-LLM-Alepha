import React from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';

const Root = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #143488;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
`;
const Main = styled.main`
  flex: 1 1 auto;
  min-width:0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

export const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <Root>
    <Sidebar />
    <Main>{children}</Main>
  </Root>
);

