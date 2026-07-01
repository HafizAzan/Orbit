import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined } from "@ant-design/icons";
import React from "react";
import { useIsDarkAppTheme } from "../../lib/app-ui-theme-utils";
import { cn } from "../../lib/utils";

type TrendBadgeProps = {
  label: string;
  trendType: "up" | "down" | "stable" | "alert";
};

function TrendBadge({ label, trendType }: TrendBadgeProps) {
  const isDark = useIsDarkAppTheme();

  const trendIcon =
    trendType === "up" ? (
      <ArrowUpOutlined className="text-[10px]" />
    ) : trendType === "down" ? (
      <ArrowDownOutlined className="text-[10px]" />
    ) : trendType === "stable" ? (
      <MinusOutlined className="text-[10px]" />
    ) : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        trendType === "up" && (isDark ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-50 text-emerald-600"),
        trendType === "down" && (isDark ? "bg-red-500/15 text-red-300" : "bg-red-50 text-red-600"),
        trendType === "stable" && (isDark ? "bg-muted-surface text-muted" : "bg-slate-100 text-slate-600"),
        trendType === "alert" && (isDark ? "bg-amber-500/15 text-amber-300" : "bg-amber-50 text-amber-600"),
      )}
    >
      {trendIcon}
      {label}
    </span>
  );
}

export default React.memo(TrendBadge);
