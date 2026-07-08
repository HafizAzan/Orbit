import { useAppUiTheme } from "../context/app-ui-theme-context";
import { isDarkAppUiTheme } from "../data/app-ui-themes";

export function useIsDarkAppTheme() {
  const { themeId } = useAppUiTheme();
  return isDarkAppUiTheme(themeId);
}

const LIGHT_SURFACE_TO_DARK: Record<string, string> = {
  "bg-indigo-50": "bg-indigo-500/15 text-indigo-300",
  "bg-sky-50": "bg-sky-500/15 text-sky-300",
  "bg-violet-50": "bg-violet-500/15 text-violet-300",
  "bg-emerald-50": "bg-emerald-500/15 text-emerald-300",
  "bg-amber-50": "bg-amber-500/15 text-amber-300",
  "bg-red-50": "bg-red-500/15 text-red-300",
  "bg-slate-50": "bg-slate-500/15 text-slate-300",
  "bg-slate-100": "bg-slate-500/15 text-slate-300",
  "bg-indigo-100 text-indigo-700": "bg-indigo-500/20 text-indigo-200",
  "bg-sky-100 text-sky-700": "bg-sky-500/20 text-sky-200",
  "bg-emerald-100 text-emerald-700": "bg-emerald-500/20 text-emerald-200",
  "bg-violet-100 text-violet-700": "bg-violet-500/20 text-violet-200",
};

export function resolveSurfaceClass(className: string, isDark: boolean) {
  if (!isDark) return className;
  return LIGHT_SURFACE_TO_DARK[className] ?? "bg-muted-surface text-foreground";
}

const BADGE_CLASS_DARK: Record<string, string> = {
  "border-red-200 bg-red-50 text-red-700": "border-red-500/30 bg-red-500/15 text-red-300",
  "bg-red-50 text-red-600 border-red-100": "border-red-500/30 bg-red-500/15 text-red-300",
  "bg-red-50 text-red-700 border-red-100": "border-red-500/30 bg-red-500/15 text-red-300",
  "border-orange-200 bg-orange-50 text-orange-700": "border-orange-500/30 bg-orange-500/15 text-orange-300",
  "border-sky-200 bg-sky-50 text-sky-700": "border-sky-500/30 bg-sky-500/15 text-sky-300",
  "bg-sky-50 text-sky-600 border-sky-100": "border-sky-500/30 bg-sky-500/15 text-sky-300",
  "bg-sky-50 text-sky-700 border-sky-100": "border-sky-500/30 bg-sky-500/15 text-sky-300",
  "border-slate-200 bg-slate-50 text-slate-600": "border-slate-500/30 bg-slate-500/15 text-slate-300",
  "border-primary/20 bg-feature-sync text-primary": "border-primary/30 bg-primary/10 text-secondary",
  "border-amber-200 bg-amber-50 text-amber-700": "border-amber-500/30 bg-amber-500/15 text-amber-300",
  "border-emerald-200 bg-emerald-50 text-emerald-700": "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  "bg-emerald-50 text-emerald-700 border-emerald-100": "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  "bg-violet-50 text-violet-600 border-violet-100": "border-violet-500/30 bg-violet-500/15 text-violet-300",
  "border-violet-200 bg-violet-50 text-violet-700": "border-violet-500/30 bg-violet-500/15 text-violet-300",
};

export function resolveBadgeClass(className: string, isDark: boolean) {
  if (!isDark) return className;
  return BADGE_CLASS_DARK[className] ?? "border-border bg-muted-surface text-foreground";
}

export function resolveAccentLinkClass(isDark: boolean) {
  return isDark
    ? "text-secondary! transition-colors hover:text-accent!"
    : "text-primary transition-opacity hover:opacity-80";
}

export function resolveTableNameLinkClass(isDark: boolean) {
  return isDark
    ? "text-foreground! transition-colors hover:text-secondary!"
    : "text-foreground transition-colors hover:text-primary";
}

export function resolveAvatarSurfaceClass(isDark: boolean) {
  return isDark ? "bg-primary/15 text-secondary" : "bg-feature-sync text-primary";
}
