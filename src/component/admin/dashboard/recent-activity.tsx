import React from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_ACTIVITY_ICONS, type ActivityItem } from "../../../data/admin-dashboard";
import { ADMIN_ROUTES } from "../../../router/admin-routes";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type RecentActivityProps = {
  items: ActivityItem[];
};

function RecentActivity({ items }: RecentActivityProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Title level={5} color="default">Recent Activity</Title>
        <Link to={ADMIN_ROUTES.ACTIVITY} className="text-sm font-medium text-primary transition-opacity hover:opacity-80">
          View All Logs
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {items.map((item) => {
          const Icon = DASHBOARD_ACTIVITY_ICONS[item.icon];

          return (
            <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  item.iconBg,
                  item.iconColor,
                )}
              >
                <Icon className="text-base" />
              </div>

              <div className="min-w-0 flex-1">
                <Text as="p" size="sm" weight="semibold">{item.title}</Text>
                <Paragraph size="sm" className="mt-0.5 mb-0!">{item.description}</Paragraph>
              </div>

              <Text as="span" size="xs" color="muted" weight="medium" className="shrink-0">{item.timeAgo}</Text>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default React.memo(RecentActivity);
