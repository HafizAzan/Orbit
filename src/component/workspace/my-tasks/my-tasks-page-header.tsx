import React from "react";
import type { MyTasksStats } from "../../../lib/workspace-my-tasks-utils";
import { Paragraph, Title } from "../../ui/typography";

export type MyTasksViewMode = "list" | "calendar";

export const MY_TASKS_VIEW_SLUGS: Record<MyTasksViewMode, string> = {
  list: "list",
  calendar: "calendar",
};

export const DEFAULT_MY_TASKS_VIEW: MyTasksViewMode = "list";

type MyTasksPageHeaderProps = {
  viewMode: MyTasksViewMode;
  stats: MyTasksStats;
  onViewModeChange: (mode: MyTasksViewMode) => void;
};

function MyTasksPageHeader({ stats }: MyTasksPageHeaderProps) {
  return (
    <div className="mb-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title level={2} className="text-2xl text-foreground lg:text-3xl">
            My Tasks
          </Title>
          <Paragraph size="sm" className="mt-1 text-muted">
            Track assigned work, update task status, and jump into project discussions.
          </Paragraph>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          {stats.assignedProjects} {stats.assignedProjects === 1 ? "project" : "projects"}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          {stats.dueToday} due today
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          {stats.inProgress} in progress
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {stats.completed} completed
        </span>
      </div>
    </div>
  );
}

export default React.memo(MyTasksPageHeader);
