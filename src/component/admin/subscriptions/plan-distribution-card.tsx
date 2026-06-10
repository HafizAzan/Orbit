import React from "react";
import type { PlanDistributionItem } from "../../../data/admin-subscriptions";
import { cn } from "../../../lib/utils";

type PlanDistributionCardProps = {
  items: PlanDistributionItem[];
};

function PlanDistributionCard({ items }: PlanDistributionCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <h3 className="text-lg font-semibold text-foreground">Plan Distribution</h3>
      <p className="mt-0.5 text-sm text-muted">Breakdown of active subscriptions by plan tier</p>

      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.id}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className={cn("text-sm font-semibold", item.color)}>{item.label}</span>
              <span className="text-sm font-bold text-foreground">{item.percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all duration-500", item.barColor)}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(PlanDistributionCard);
