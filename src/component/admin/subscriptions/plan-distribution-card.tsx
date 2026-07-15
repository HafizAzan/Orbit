import React from "react";
import type { PlanDistributionItem } from "../../../data/admin-subscriptions";
import { cn } from "../../../lib/utils";
import EmptyStatePanel from "../../ui/empty-state-panel";
import { Paragraph, Text, Title } from "../../ui/typography";

type PlanDistributionCardProps = {
  items: PlanDistributionItem[];
};

function PlanDistributionCard({ items }: PlanDistributionCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default">Plan Distribution</Title>
      <Paragraph size="sm" className="mt-0.5 mb-0!">Breakdown of active subscriptions by plan tier</Paragraph>

      {items.length === 0 ? (
        <EmptyStatePanel
          className="mt-6"
          compact
          description="No active subscription distribution yet."
        />
      ) : (
        <ul className="mt-6 space-y-5">
          {items.map((item) => (
            <li key={item.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <Text size="sm" weight="semibold" className={item.color}>{item.label}</Text>
                <Text size="sm" weight="bold">{item.percentage}%</Text>
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
      )}
    </article>
  );
}

export default React.memo(PlanDistributionCard);
