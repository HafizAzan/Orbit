import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import type { ActivityFeedItem } from "../../../types/activity.types";
import type { WorkspaceActivityItem } from "../../../data/workspace-dashboard";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";

type GlobalActivityFeedProps = {
  items: WorkspaceActivityItem[] | ActivityFeedItem[];
};

function GlobalActivityFeed({ items }: GlobalActivityFeedProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Global Activity</h3>
        <Link to={WORKSPACE_ROUTES.ACTIVITY_LOGS}>
          <Button type="link" className="h-auto px-0 font-semibold!">
            View all activities
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-sm text-muted">
          No recent workspace activity yet. Actions on tasks, projects, and teams will appear here.
        </div>
      ) : (
        <ul className="mt-5 flex-1 space-y-5">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="flex gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  item.avatarColor,
                )}
              >
                {getInitial(item.userName)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{item.userName}</span>{" "}
                  <span className="text-muted">{item.action}</span>{" "}
                  <span className="font-semibold">{item.target}</span>
                </p>
                {"comment" in item && item.comment ? (
                  <p className="mt-2 rounded-2xl bg-indigo-50 px-3 py-2 text-sm text-indigo-900">{item.comment}</p>
                ) : null}
                <p className="mt-1 text-xs font-medium text-muted">{item.timeAgo}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default React.memo(GlobalActivityFeed);
