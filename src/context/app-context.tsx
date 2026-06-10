import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "../lib/toast";
import type { AuthUser } from "../lib/auth";

type AppContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: user !== null,
      isLoading,
      setIsLoading,
    }),
    [user, isLoading],
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
