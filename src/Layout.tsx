import React from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #26358C;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
`;
const Main = styled.main`
  flex: 1 1 auto;
  min-width:0;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: transparent;
  overflow: auto;
`;

export const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <Root>
    <Sidebar />
    <Main>{children}</Main>
  </Root>
);

