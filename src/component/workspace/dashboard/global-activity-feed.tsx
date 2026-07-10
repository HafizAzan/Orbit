import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import type { ActivityFeedItem } from "../../../types/activity.types";
import type { WorkspaceActivityItem } from "../../../data/workspace-dashboard";
import { getInitial } from "../../../lib/helper";
import { resolveSurfaceClass, useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import { cn } from "../../../lib/utils";
import { WORKSPACE_ROUTES } from "../../../router/workspace-routes";
import { Paragraph, Text, Title } from "../../ui/typography";

type GlobalActivityFeedProps = {
  items: WorkspaceActivityItem[] | ActivityFeedItem[];
};

function GlobalActivityFeed({ items }: GlobalActivityFeedProps) {
  const isDark = useIsDarkAppTheme();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <Title level={5} color="default">Global Activity</Title>
        <Link to={WORKSPACE_ROUTES.ACTIVITY_LOGS}>
          <Button type="link" className="h-auto px-0 font-semibold!">
            View all activities
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <Paragraph size="sm" className="mt-5 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10">
          No recent workspace activity yet. Actions on tasks, projects, and teams will appear here.
        </Paragraph>
      ) : (
        <ul className="mt-5 min-h-40 max-h-80 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="flex gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  resolveSurfaceClass(item.avatarColor, isDark),
                )}
              >
                {getInitial(item.userName)}
              </div>

              <div className="min-w-0 flex-1">
                <Text as="p" size="sm">
                  <Text as="span" weight="semibold">{item.userName}</Text>{" "}
                  <Text as="span" color="muted">{item.action}</Text>{" "}
                  <Text as="span" weight="semibold">{item.target}</Text>
                </Text>
                {"comment" in item && item.comment ? (
                  <Text as="p" size="sm" className="mt-2 rounded-2xl bg-muted-surface px-3 py-2 text-foreground">{item.comment}</Text>
                ) : null}
                <Text as="p" size="xs" weight="medium" color="muted" className="mt-1">{item.timeAgo}</Text>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default React.memo(GlobalActivityFeed);
