export type AppUiThemeId = "classic" | "ocean" | "sunset" | "forest" | "royal" | "midnight";

export type AppUiThemeDefinition = {
  id: AppUiThemeId;
  label: string;
  description: string;
  previewGradient: string;
  antdPrimary: string;
};

export const APP_UI_THEMES: AppUiThemeDefinition[] = [
  {
    id: "classic",
    label: "Classic",
    description: "FlowSync default — indigo on clean slate.",
    previewGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    antdPrimary: "#4f46e5",
  },
  {
    id: "ocean",
    label: "Teal",
    description: "Same layout as Classic, calm teal accent.",
    previewGradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    antdPrimary: "#0d9488",
  },
  {
    id: "sunset",
    label: "Amber",
    description: "Neutral surfaces with a warm amber accent.",
    previewGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    antdPrimary: "#d97706",
  },
  {
    id: "forest",
    label: "Emerald",
    description: "Classic feel with a fresh green accent.",
    previewGradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    antdPrimary: "#059669",
  },
  {
    id: "royal",
    label: "Violet",
    description: "Soft violet accent on the standard light UI.",
    previewGradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
    antdPrimary: "#7c3aed",
  },
  {
    id: "midnight",
    label: "Dark",
    description: "Polished dark mode for low-light work.",
    previewGradient: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)",
    antdPrimary: "#6366f1",
  },
];

export const DEFAULT_APP_UI_THEME: AppUiThemeId = "classic";

export function getAppUiTheme(themeId?: string | null): AppUiThemeDefinition {
  return APP_UI_THEMES.find((theme) => theme.id === themeId) ?? APP_UI_THEMES[0];
}

export function isAppUiTheme(value: string): value is AppUiThemeId {
  return APP_UI_THEMES.some((theme) => theme.id === value);
}

export function applyAppUiTheme(themeId: AppUiThemeId) {
  document.documentElement.dataset.appTheme = themeId;
}

export function clearAppUiTheme() {
  delete document.documentElement.dataset.appTheme;
}
