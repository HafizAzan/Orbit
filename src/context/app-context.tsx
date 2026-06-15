import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getMe } from "../api-services/auth.service";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveStoredUser,
} from "../lib/auth-session";
import { toast } from "../lib/toast";
import type { AuthUser } from "../types/auth.types";

type AppContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isBootstrapping: boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

function AppProvider({ children }: AppProviderProps) {
  const [user, setUserState] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const setUser = useCallback((next: AuthUser | null) => {
    if (next) {
      saveStoredUser(next);
    } else {
      clearAuthSession();
    }
    setUserState(next);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      const token = getAccessToken();
      const storedUser = getStoredUser();

      if (!token) {
        if (storedUser) clearAuthSession();
        if (!cancelled) {
          setUserState(null);
          setIsBootstrapping(false);
        }
        return;
      }

      if (storedUser && !cancelled) {
        setUserState(storedUser);
      }

      try {
        const freshUser = await getMe();
        if (!cancelled) {
          saveStoredUser(freshUser);
          setUserState(freshUser);
        }
      } catch {
        if (!cancelled) {
          clearAuthSession();
          setUserState(null);
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    void bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: user !== null,
      isLoading,
      setIsLoading,
      isBootstrapping,
    }),
    [user, isLoading, isBootstrapping],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    toast.error("useAppContext must be used within AppProvider");
    return undefined;
  }
  return context;
}

export { AppProvider, useAppContext };
export default React.memo(AppProvider);
