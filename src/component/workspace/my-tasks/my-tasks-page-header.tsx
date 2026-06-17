import { CalendarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import React from "react";
import { Paragraph, Title } from "../../ui/typography";
import { cn } from "../../../lib/utils";

export type MyTasksViewMode = "list" | "calendar";

type MyTasksPageHeaderProps = {
  viewMode: MyTasksViewMode;
  onViewModeChange: (mode: MyTasksViewMode) => void;
};

function MyTasksPageHeader({ viewMode, onViewModeChange }: MyTasksPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title level={2} className="text-2xl text-foreground lg:text-3xl">
          My Tasks
        </Title>
        <Paragraph size="sm" className="mt-1 text-muted">
          Manage and track your personal task list across all projects.
        </Paragraph>
      </div>

      <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-foreground",
          )}
        >
          <UnorderedListOutlined />
          List
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("calendar")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            viewMode === "calendar" ? "bg-primary text-white" : "text-muted hover:text-foreground",
          )}
        >
          <CalendarOutlined />
          Calendar
        </button>
      </div>
    </div>
  );
}

export default React.memo(MyTasksPageHeader);
