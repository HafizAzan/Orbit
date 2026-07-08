import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { updateUiTheme } from "../api-services/auth.service";
import { useAppContext } from "./app-context";
import {
  applyAppUiTheme,
  clearAppUiTheme,
  DEFAULT_APP_UI_THEME,
  getAppUiTheme,
  normalizeAppUiThemeId,
  type AppUiThemeId,
} from "../data/app-ui-themes";
import { showApiErrorToast } from "../lib/api-error";

type AppUiThemeContextValue = {
  themeId: AppUiThemeId;
  antdPrimary: string;
  isSaving: boolean;
  setTheme: (themeId: AppUiThemeId) => Promise<void>;
};

const AppUiThemeContext = createContext<AppUiThemeContextValue | undefined>(undefined);

type AppUiThemeProviderProps = {
  children: ReactNode;
};

function resolveThemeId(value?: string | null): AppUiThemeId {
  return normalizeAppUiThemeId(value);
}

function AppUiThemeProvider({ children }: AppUiThemeProviderProps) {
  const { user, setUser, isAuthenticated } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const themeId = isAuthenticated ? resolveThemeId(user?.uiTheme) : DEFAULT_APP_UI_THEME;
  const theme = getAppUiTheme(themeId);

  useEffect(() => {
    if (isAuthenticated) {
      applyAppUiTheme(themeId);
      return;
    }

    clearAppUiTheme();
  }, [isAuthenticated, themeId]);

  const setTheme = useCallback(
    async (nextThemeId: AppUiThemeId) => {
      if (!user) return;

      applyAppUiTheme(nextThemeId);
      setUser({ ...user, uiTheme: nextThemeId });

      setIsSaving(true);
      try {
        const updatedUser = await updateUiTheme(nextThemeId);
        setUser(updatedUser);
      } catch (error) {
        applyAppUiTheme(resolveThemeId(user.uiTheme));
        setUser({ ...user, uiTheme: user.uiTheme ?? DEFAULT_APP_UI_THEME });
        showApiErrorToast(error);
      } finally {
        setIsSaving(false);
      }
    },
    [setUser, user],
  );

  const value = useMemo(
    () => ({
      themeId,
      antdPrimary: theme.antdPrimary,
      isSaving,
      setTheme,
    }),
    [isSaving, setTheme, theme.antdPrimary, themeId],
  );

  return <AppUiThemeContext.Provider value={value}>{children}</AppUiThemeContext.Provider>;
}

function useAppUiTheme() {
  const context = useContext(AppUiThemeContext);

  if (context === undefined) {
    throw new Error("useAppUiTheme must be used within AppUiThemeProvider");
  }

  return context;
}

export { AppUiThemeProvider, useAppUiTheme };
