import { useMemo } from "react";
import { useIsDarkAppTheme } from "./app-ui-theme-utils";

function readCssVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function useChartTheme() {
  const isDark = useIsDarkAppTheme();

  return useMemo(
    () => ({
      isDark,
      grid: readCssVar("--color-chart-grid", isDark ? "#243044" : "#e2e8f0"),
      axis: readCssVar("--color-chart-axis", isDark ? "#94a3b8" : "#64748b"),
      primary: readCssVar("--color-primary", "#4f46e5"),
      tooltipBorder: readCssVar("--color-border", isDark ? "#243044" : "#e2e8f0"),
      tooltipBg: readCssVar("--color-card", isDark ? "#151c2f" : "#ffffff"),
      tooltipShadow: isDark
        ? "0 8px 24px rgba(0, 0, 0, 0.45)"
        : "0 4px 12px rgba(15, 23, 42, 0.08)",
      activeDotStroke: readCssVar("--color-card", isDark ? "#151c2f" : "#ffffff"),
      gradientTop: isDark ? "rgba(129, 140, 248, 0.35)" : "rgba(129, 140, 248, 0.35)",
      gradientBottom: isDark ? "rgba(129, 140, 248, 0.02)" : "rgba(129, 140, 248, 0.02)",
    }),
    [isDark],
  );
}
