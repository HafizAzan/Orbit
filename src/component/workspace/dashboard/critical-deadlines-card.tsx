import { TeamOutlined } from "@ant-design/icons";
import React from "react";
import type { CriticalDeadline } from "../../../data/workspace-dashboard";
import { cn } from "../../../lib/utils";

type CriticalDeadlinesCardProps = {
  items: CriticalDeadline[];
};

function CriticalDeadlinesCard({ items }: CriticalDeadlinesCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
      <h3 className="text-lg font-semibold text-foreground">Critical Deadlines</h3>

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
              <span className="text-[10px] font-bold tracking-wider text-muted uppercase">{item.month}</span>
              <span className="text-xl font-bold text-foreground">{item.day}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{item.title}</p>
                {item.priority === "high" ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                    High Priority
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
              {item.assignees ? (
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted">
                  <TeamOutlined />
                  {item.assignees} assignees
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default React.memo(CriticalDeadlinesCard);
