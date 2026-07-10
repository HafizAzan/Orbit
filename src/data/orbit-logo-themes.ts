import type { AppUiThemeId } from "./app-ui-themes";

export type OrbitLogoPalette = {
  markBg: string;
  markFg: string;
  ring: string;
  satellite: string;
  wordmark: string;
  glow?: string;
};

/** Per-theme Orbit logo colors — mark + wordmark adapt with the active UI theme. */
export const ORBIT_LOGO_PALETTES: Record<AppUiThemeId, OrbitLogoPalette> = {
  classic: {
    markBg: "#4f46e5",
    markFg: "#ffffff",
    ring: "#c7d2fe",
    satellite: "#a5b4fc",
    wordmark: "#0f172a",
  },
  teal: {
    markBg: "#0d9488",
    markFg: "#ffffff",
    ring: "#99f6e4",
    satellite: "#5eead4",
    wordmark: "#0f172a",
  },
  amber: {
    markBg: "#d97706",
    markFg: "#ffffff",
    ring: "#fde68a",
    satellite: "#fbbf24",
    wordmark: "#0f172a",
  },
  dark: {
    markBg: "#312e81",
    markFg: "#e0e7ff",
    ring: "#818cf8",
    satellite: "#a5b4fc",
    wordmark: "#e2e8f0",
    glow: "#6366f1",
  },
  onyx: {
    markBg: "#164e63",
    markFg: "#ecfeff",
    ring: "#22d3ee",
    satellite: "#67e8f9",
    wordmark: "#e4e4e7",
    glow: "#06b6d4",
  },
  navy: {
    markBg: "#1e3a8a",
    markFg: "#dbeafe",
    ring: "#60a5fa",
    satellite: "#93c5fd",
    wordmark: "#e2e8f0",
    glow: "#3b82f6",
  },
};

export function getOrbitLogoPalette(themeId: AppUiThemeId): OrbitLogoPalette {
  return ORBIT_LOGO_PALETTES[themeId] ?? ORBIT_LOGO_PALETTES.classic;
}
