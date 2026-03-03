import React from 'react';
import styled from 'styled-components';
import { LayoutProvider } from './LayoutContext';
import { Sidebar } from './Sidebar';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
`;
const Main = styled.main`
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: #f1f5f9;
  overflow: hidden;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LayoutProvider>
    <Root>
      <Sidebar />
      <Main>{children}</Main>
    </Root>
  </LayoutProvider>
);

