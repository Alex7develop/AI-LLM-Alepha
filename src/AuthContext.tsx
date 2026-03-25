import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { validateToken, type ValidateTokenUser } from './api/client';
import { clearTokenFromUrl, getAuthToken, getTokenFromUrl, setAuthToken } from './utils/authToken';
import { getOrCreateChatUserId } from './utils/chatUserId';

type AuthContextValue = {
  isAuthorized: boolean;
  authLoading: boolean;
  authValidatedTrigger: number;
  userName: string | null;
  userId: string | null;
  userData: ValidateTokenUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authValidatedTrigger, setAuthValidatedTrigger] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<ValidateTokenUser | null>(null);

  const checkAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      let token = getAuthToken();
      const tokenFromUrl = getTokenFromUrl();

      if (tokenFromUrl) {
        setAuthToken(tokenFromUrl);
        clearTokenFromUrl();
        token = tokenFromUrl;
      }

      if (!token) {
        setIsAuthorized(false);
        setUserName(null);
        setUserId(null);
        setUserData(null);
        return;
      }

      const chatUserId = getOrCreateChatUserId();
      const user = await validateToken(token, chatUserId);
      setIsAuthorized(!!user);
      setUserName(user?.name ?? null);
      setUserId(user?.id ?? null);
      setUserData(user ?? null);
      if (user) {
        setAuthValidatedTrigger((v) => v + 1);
      }
    } catch {
      setIsAuthorized(false);
      setUserName(null);
      setUserId(null);
      setUserData(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextValue = {
    isAuthorized,
    authLoading,
    authValidatedTrigger,
    userName,
    userId,
    userData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
