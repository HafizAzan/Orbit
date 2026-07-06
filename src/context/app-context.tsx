import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getMe } from "../api-services/auth.service";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  isAuthSessionExpired,
  isRememberMeEnabled,
  saveStoredUser,
} from "../lib/auth-session";
import type { AuthUser } from "../types/auth.types";

type AppContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
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
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  const setUser = useCallback((next: AuthUser | null) => {
    if (next) {
      saveStoredUser(next, isRememberMeEnabled());
    } else {
      clearAuthSession();
    }
    setUserState(next);
  }, []);

  const refreshUser = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const promise = (async () => {
      const token = getAccessToken();

      if (!token) {
        clearAuthSession();
        setUserState(null);
        return;
      }

      try {
        const freshUser = await getMe();
        saveStoredUser(freshUser);
        setUserState(freshUser);
      } catch {
        clearAuthSession();
        setUserState(null);
      }
    })();

    refreshPromiseRef.current = promise;

    try {
      await promise;
    } finally {
      refreshPromiseRef.current = null;
    }
  }, []);

  useEffect(() => {
    const enforceSessionExpiry = () => {
      if (!isAuthSessionExpired()) return false;

      clearAuthSession();
      setUserState(null);
      return true;
    };

    enforceSessionExpiry();

    const intervalId = window.setInterval(enforceSessionExpiry, 60_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        enforceSessionExpiry();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      if (isAuthSessionExpired()) {
        clearAuthSession();
        if (!cancelled) {
          setUserState(null);
          setIsBootstrapping(false);
        }
        return;
      }

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
        await refreshUser();
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    void bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshUser,
      isAuthenticated: user !== null,
      isLoading,
      setIsLoading,
      isBootstrapping,
    }),
    [user, setUser, refreshUser, isLoading, isBootstrapping],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

export { AppProvider, useAppContext };
export default React.memo(AppProvider);
