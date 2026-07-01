import { useAppUiTheme } from "../context/app-ui-theme-context";

export function useIsDarkAppTheme() {
  const { themeId } = useAppUiTheme();
  return themeId === "midnight";
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
