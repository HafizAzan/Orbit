import { ArrowUpOutlined } from "@ant-design/icons";
import React from "react";
import { DASHBOARD_METRIC_ICONS, type DashboardMetric } from "../../../data/admin-dashboard";
import { cn } from "../../../lib/utils";

type MetricCardProps = {
  metric: DashboardMetric;
};

function MetricCard({ metric }: MetricCardProps) {
  const Icon = DASHBOARD_METRIC_ICONS[metric.icon];

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-primary", metric.iconBg)}>
          <Icon className="text-lg" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
          <ArrowUpOutlined className="text-[10px]" />
          {metric.trend}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-muted">{metric.label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{metric.value}</p>
    </article>
  );
}

export default React.memo(MetricCard);
