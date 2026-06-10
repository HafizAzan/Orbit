import React from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_ACTIVITY_ICONS, type ActivityItem } from "../../../data/admin-dashboard";
import { ADMIN_ROUTES } from "../../../router/admin-routes";
import { cn } from "../../../lib/utils";

type RecentActivityProps = {
  items: ActivityItem[];
};

function RecentActivity({ items }: RecentActivityProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
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
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.description}</p>
              </div>

              <span className="shrink-0 text-xs font-medium text-muted">{item.timeAgo}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default React.memo(RecentActivity);
