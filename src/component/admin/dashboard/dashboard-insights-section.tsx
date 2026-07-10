import React from "react";
import {
  type ActiveOrgItem,
  type RecentSignupItem,
  type TopOrgItem,
} from "../../../data/admin-dashboard";
import { formatCurrency } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";


function TopOrgsList({ items }: { items: TopOrgItem[] }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Title level={5} color="default">Top Orgs (Revenue)</Title>
      <ul className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold", item.color)}>
                {item.initial}
              </span>
              <div className="min-w-0">
                <Text as="p" weight="semibold" className="truncate">{item.name}</Text>
                <Paragraph size="xs" className="mb-0!">{item.plan}</Paragraph>
              </div>
            </div>
            <Text as="span" size="sm" weight="bold" className="shrink-0">{formatCurrency(item.revenue)}</Text>
          </li>
        ))}
      </ul>
    </article>
  );
}

function MostActiveList({ items }: { items: ActiveOrgItem[] }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Title level={5} color="default">Most Active</Title>
      <ul className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.avatarSeed}`}
                  alt=""
                  className="h-9 w-9 rounded-lg bg-background object-cover"
                />
                <div className="min-w-0">
                  <Text as="p" weight="semibold" className="truncate">{item.name}</Text>
                  <Paragraph size="xs" className="mb-0!">{item.sessions} sessions</Paragraph>
                </div>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.activity}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-4 text-sm font-medium text-primary hover:opacity-80">
        View All Activities
      </button>
    </article>
  );
}

function RecentSignupsList({ items }: { items: RecentSignupItem[] }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Title level={5} color="default">Recent Signups</Title>
      <ul className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <Text as="p" weight="semibold" className="truncate">{item.name}</Text>
              <Paragraph size="xs" className="mb-0!">{item.timeAgo}</Paragraph>
            </div>
            <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide", item.badgeClass)}>
              {item.planBadge}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function DashboardInsightsSection({
  topOrgs = [],
  recentSignups = [],
}: {
  topOrgs?: TopOrgItem[];
  recentSignups?: RecentSignupItem[];
}) {
  const activeFromSignups: ActiveOrgItem[] = recentSignups.slice(0, 4).map((item, index) => ({
    id: item.id,
    name: item.name,
    sessions: Math.max(20, 100 - index * 15),
    activity: Math.max(40, 90 - index * 12),
    avatarSeed: item.name,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TopOrgsList items={topOrgs} />
      <MostActiveList items={activeFromSignups} />
      <RecentSignupsList items={recentSignups} />
    </div>
  );
}

export default React.memo(DashboardInsightsSection);
