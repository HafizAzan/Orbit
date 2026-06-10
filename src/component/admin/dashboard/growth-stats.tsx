import React from "react";
import type { GrowthStat } from "../../../data/admin-dashboard";

type GrowthStatCardProps = {
  stat: GrowthStat;
};

export function GrowthStatCard({ stat }: GrowthStatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-50">
        <div
          className="h-full rounded-full bg-linear-to-r from-indigo-400 to-primary transition-all duration-500"
          style={{ width: `${stat.progress}%` }}
        />
      </div>

      <p className="mt-3 text-xs font-medium text-emerald-600">{stat.helperText}</p>
    </article>
  );
}

type GrowthStatsProps = {
  stats: GrowthStat[];
};

function GrowthStats({ stats }: GrowthStatsProps) {
  return (
    <div className="flex flex-col gap-4">
      {stats.map((stat) => (
        <GrowthStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export default React.memo(GrowthStats);
