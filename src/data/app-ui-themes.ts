export type AppUiThemeId = "classic" | "teal" | "amber" | "dark" | "onyx" | "navy";

export type AppUiThemeDefinition = {
  id: AppUiThemeId;
  label: string;
  description: string;
  previewGradient: string;
  antdPrimary: string;
  mode: "light" | "dark";
};

const LEGACY_THEME_ALIASES: Record<string, AppUiThemeId> = {
  ocean: "teal",
  sunset: "amber",
  midnight: "dark",
  forest: "classic",
  royal: "classic",
};

export const DARK_APP_UI_THEME_IDS: AppUiThemeId[] = ["dark", "onyx", "navy"];

export const APP_UI_THEMES: AppUiThemeDefinition[] = [
  {
    id: "classic",
    label: "Classic",
    description: "FlowSync default — indigo on clean slate.",
    previewGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    antdPrimary: "#4f46e5",
    mode: "light",
  },
  {
    id: "teal",
    label: "Teal",
    description: "Neutral surfaces with a calm teal accent.",
    previewGradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    antdPrimary: "#0d9488",
    mode: "light",
  },
  {
    id: "amber",
    label: "Amber",
    description: "Warm amber accent on the standard light UI.",
    previewGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    antdPrimary: "#d97706",
    mode: "light",
  },
  {
    id: "dark",
    label: "Dark",
    description: "Polished indigo dark mode for low-light work.",
    previewGradient: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)",
    antdPrimary: "#6366f1",
    mode: "dark",
  },
  {
    id: "onyx",
    label: "Onyx",
    description: "Charcoal dark mode with a cool cyan accent.",
    previewGradient: "linear-gradient(135deg, #3f3f46 0%, #09090b 100%)",
    antdPrimary: "#06b6d4",
    mode: "dark",
  },
  {
    id: "navy",
    label: "Navy",
    description: "Deep blue dark mode for focused night sessions.",
    previewGradient: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
    antdPrimary: "#3b82f6",
    mode: "dark",
  },
];

export const DEFAULT_APP_UI_THEME: AppUiThemeId = "classic";

export function normalizeAppUiThemeId(themeId?: string | null): AppUiThemeId {
  if (!themeId) return DEFAULT_APP_UI_THEME;

  const normalized = LEGACY_THEME_ALIASES[themeId] ?? themeId;
  if (APP_UI_THEMES.some((theme) => theme.id === normalized)) {
    return normalized as AppUiThemeId;
  }

  return DEFAULT_APP_UI_THEME;
}

export function getAppUiTheme(themeId?: string | null): AppUiThemeDefinition {
  return APP_UI_THEMES.find((theme) => theme.id === normalizeAppUiThemeId(themeId)) ?? APP_UI_THEMES[0];
}

export function isAppUiTheme(value: string): value is AppUiThemeId {
  return APP_UI_THEMES.some((theme) => theme.id === value) || value in LEGACY_THEME_ALIASES;
}

export function isDarkAppUiTheme(themeId: AppUiThemeId) {
  return DARK_APP_UI_THEME_IDS.includes(themeId);
}

export function applyAppUiTheme(themeId: AppUiThemeId) {
  document.documentElement.dataset.appTheme = themeId;
}

export function clearAppUiTheme() {
  delete document.documentElement.dataset.appTheme;
}
