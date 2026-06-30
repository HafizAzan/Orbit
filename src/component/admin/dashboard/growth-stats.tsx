import React from "react";
import type { GrowthStat } from "../../../data/admin-dashboard";
import { Text } from "../../ui/typography";

type GrowthStatCardProps = {
  stat: GrowthStat;
};

export function GrowthStatCard({ stat }: GrowthStatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Text as="p" size="sm" color="muted" weight="medium">{stat.label}</Text>
          <Text as="p" className="mt-1 text-3xl font-bold">{stat.value}</Text>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-50">
        <div
          className="h-full rounded-full bg-linear-to-r from-indigo-400 to-primary transition-all duration-500"
          style={{ width: `${stat.progress}%` }}
        />
      </div>

      <Text as="p" size="xs" weight="medium" className="mt-3 text-emerald-600">{stat.helperText}</Text>
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
