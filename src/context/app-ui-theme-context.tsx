import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { updateUiTheme } from '../api-services/auth.service';
import {
  applyAppUiTheme,
  clearAppUiTheme,
  DEFAULT_APP_UI_THEME,
  getAppUiTheme,
  normalizeAppUiThemeId,
  type AppUiThemeId,
} from '../data/app-ui-themes';
import { showApiErrorToast } from '../lib/api-error';
import { isAppUiThemePath } from '../lib/app-ui-theme-scope';
import { useAppContext } from './app-context';

type AppUiThemeContextValue = {
  /** Theme currently applied to the document (classic on public/auth). */
  themeId: AppUiThemeId;
  /** User's saved preference (used by the theme picker). */
  preferredThemeId: AppUiThemeId;
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
  const { pathname } = useLocation();
  const { user, setUser, isAuthenticated } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const preferredThemeId = isAuthenticated
    ? resolveThemeId(user?.uiTheme)
    : DEFAULT_APP_UI_THEME;
  const themeAllowed = isAuthenticated && isAppUiThemePath(pathname);
  const themeId = themeAllowed ? preferredThemeId : DEFAULT_APP_UI_THEME;
  const theme = getAppUiTheme(themeId);

  useEffect(() => {
    if (themeAllowed) {
      applyAppUiTheme(preferredThemeId);
      return;
    }

    clearAppUiTheme();
  }, [preferredThemeId, themeAllowed]);

  const setTheme = useCallback(
    async (nextThemeId: AppUiThemeId) => {
      if (!user) return;

      if (isAppUiThemePath(window.location.pathname)) {
        applyAppUiTheme(nextThemeId);
      }
      setUser({ ...user, uiTheme: nextThemeId });

      setIsSaving(true);
      try {
        const updatedUser = await updateUiTheme(nextThemeId);
        setUser(updatedUser);
      } catch (error) {
        if (isAppUiThemePath(window.location.pathname)) {
          applyAppUiTheme(resolveThemeId(user.uiTheme));
        }
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
      preferredThemeId,
      antdPrimary: theme.antdPrimary,
      isSaving,
      setTheme,
    }),
    [isSaving, preferredThemeId, setTheme, theme.antdPrimary, themeId],
  );

  return <AppUiThemeContext.Provider value={value}>{children}</AppUiThemeContext.Provider>;
}

function useAppUiTheme() {
  const context = useContext(AppUiThemeContext);

  if (context === undefined) {
    throw new Error('useAppUiTheme must be used within AppUiThemeProvider');
  }

  return context;
}

export { AppUiThemeProvider, useAppUiTheme };
