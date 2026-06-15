import React from "react";
import type { WorkspaceActivityItem } from "../../../data/workspace-dashboard";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";

type GlobalActivityFeedProps = {
  items: WorkspaceActivityItem[];
};

function GlobalActivityFeed({ items }: GlobalActivityFeedProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <h3 className="text-lg font-semibold text-foreground">Global Activity</h3>

      <ul className="mt-5 space-y-5">
        {items.map((item) => (
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
              {item.comment ? (
                <p className="mt-2 rounded-2xl bg-indigo-50 px-3 py-2 text-sm text-indigo-900">{item.comment}</p>
              ) : null}
              <p className="mt-1 text-xs font-medium text-muted">{item.timeAgo}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(GlobalActivityFeed);
