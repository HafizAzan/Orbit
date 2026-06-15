import React from "react";
import { WORKSPACE_METRIC_ICONS, type WorkspaceMetric } from "../../../data/workspace-dashboard";
import TrendBadge from "../../ui/trend-badge";
import { cn } from "../../../lib/utils";

type WorkspaceMetricCardProps = {
  metric: WorkspaceMetric;
};

function WorkspaceMetricCard({ metric }: WorkspaceMetricCardProps) {
  const Icon = WORKSPACE_METRIC_ICONS[metric.icon];

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-primary", metric.iconBg)}>
          <Icon className="text-lg" />
        </div>
        <TrendBadge label={metric.trend} trendType={metric.trendType} />
      </div>

      <p className="mt-4 text-sm font-medium text-muted">{metric.label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{metric.value}</p>
    </article>
  );
}

export default React.memo(WorkspaceMetricCard);
