import React, { createContext, useContext, useState } from 'react';

type LayoutContextValue = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const value: LayoutContextValue = {
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((v) => !v),
    openSidebar: () => setSidebarOpen(true),
  };
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = (): LayoutContextValue => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
};
