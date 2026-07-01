import React from "react";
import { WORKSPACE_METRIC_ICONS, type WorkspaceMetric } from "../../../data/workspace-dashboard";
import { resolveSurfaceClass, useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import TrendBadge from "../../ui/trend-badge";
import { cn } from "../../../lib/utils";
import { Text } from "../../ui/typography";

type WorkspaceMetricCardProps = {
  metric: WorkspaceMetric;
};

function WorkspaceMetricCard({ metric }: WorkspaceMetricCardProps) {
  const Icon = WORKSPACE_METRIC_ICONS[metric.icon];
  const isDark = useIsDarkAppTheme();

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-primary", resolveSurfaceClass(metric.iconBg, isDark))}>
          <Icon className="text-lg" />
        </div>
        <TrendBadge label={metric.trend} trendType={metric.trendType} />
      </div>

      <Text as="p" size="sm" weight="medium" color="muted" className="mt-4">{metric.label}</Text>
      <Text as="p" weight="bold" className="mt-1 text-2xl tracking-tight lg:text-3xl">{metric.value}</Text>
    </article>
  );
}

export default React.memo(WorkspaceMetricCard);
