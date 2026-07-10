import React from "react";
import type { ProjectActivityItem } from "../../../data/workspace-project-detail";
import { getInitial } from "../../../lib/helper";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type ProjectActivityFeedProps = {
  items: ProjectActivityItem[];
};

function ProjectActivityFeed({ items }: ProjectActivityFeedProps) {
  return (
    <article className="flex min-h-56 max-h-96 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default" className="shrink-0">
        Activity Feed
      </Title>

      {items.length === 0 ? (
        <Paragraph size="sm" className="mt-5">
          No task activity yet for this project.
        </Paragraph>
      ) : (
        <ul className="mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  item.iconBg,
                  item.iconColor,
                )}
              >
                {getInitial(item.userName)}
              </div>

              <div className="min-w-0 flex-1">
                <Text as="p" size="sm">
                  <Text as="span" weight="semibold">
                    {item.userName}
                  </Text>{" "}
                  <Text as="span" color="muted">
                    {item.action}
                  </Text>
                  {item.target ? (
                    <Text as="span" weight="semibold">
                      {" "}
                      {item.target}
                    </Text>
                  ) : null}
                </Text>
                {item.comment ? (
                  <Text
                    as="p"
                    size="sm"
                    className="mt-2 rounded-2xl bg-indigo-50 px-3 py-2 text-indigo-900"
                  >
                    {item.comment}
                  </Text>
                ) : null}
                <Text as="p" size="xs" weight="medium" color="muted" className="mt-1">
                  {item.timeAgo}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default React.memo(ProjectActivityFeed);
