import { TeamOutlined } from "@ant-design/icons";
import React from "react";
import type { CriticalDeadline } from "../../../data/workspace-dashboard";
import { cn } from "../../../lib/utils";
import { Paragraph, Text, Title } from "../../ui/typography";

type CriticalDeadlinesCardProps = {
  items: CriticalDeadline[];
};

function CriticalDeadlinesCard({ items }: CriticalDeadlinesCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <Title level={5} color="default">Critical Deadlines</Title>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex gap-4 rounded-2xl border p-4",
              item.priority === "high" ? "border-red-100 bg-red-50/40" : "border-border bg-background/50",
            )}
          >
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-card text-center">
              <Text as="span" size="xs" weight="bold" color="muted" className="text-[10px]! tracking-wider uppercase">{item.month}</Text>
              <Text as="span" weight="bold" className="text-xl">{item.day}</Text>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Text as="p" weight="semibold">{item.title}</Text>
                {item.priority === "high" ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                    High Priority
                  </span>
                ) : null}
              </div>
              <Paragraph size="sm" className="mt-1">{item.subtitle}</Paragraph>
              {item.assignees ? (
                <Text as="p" size="xs" weight="medium" color="muted" className="mt-2 inline-flex items-center gap-1">
                  <TeamOutlined />
                  {item.assignees} assignees
                </Text>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(CriticalDeadlinesCard);
