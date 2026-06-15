import {
  AppstoreOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import React from "react";
import type { ProjectsViewMode } from "../../../data/workspace-projects";
import {
  PROJECT_PRIORITY_FILTER_OPTIONS,
  PROJECT_STATUS_FILTER_OPTIONS,
  PROJECT_TEAM_FILTER_OPTIONS,
} from "../../../data/workspace-projects";
import { cn } from "../../../lib/utils";

type ProjectsToolbarProps = {
  statusFilter: string;
  priorityFilter: string;
  teamFilter: string;
  viewMode: ProjectsViewMode;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  onViewModeChange: (mode: ProjectsViewMode) => void;
};

function ProjectsToolbar({
  statusFilter,
  priorityFilter,
  teamFilter,
  viewMode,
  onStatusChange,
  onPriorityChange,
  onTeamChange,
  onViewModeChange,
}: ProjectsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={statusFilter}
          onChange={onStatusChange}
          className="min-w-[180px]"
          options={PROJECT_STATUS_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Status: ${option.label}`,
          }))}
        />
        <Select
          value={priorityFilter}
          onChange={onPriorityChange}
          className="min-w-[150px]"
          options={PROJECT_PRIORITY_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Priority: ${option.label}`,
          }))}
          suffixIcon={<ExclamationCircleOutlined className="text-muted!" />}
        />
        <Select
          value={teamFilter}
          onChange={onTeamChange}
          className="min-w-[170px]"
          options={PROJECT_TEAM_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Team: ${option.label}`,
          }))}
          suffixIcon={<TeamOutlined className="text-muted!" />}
        />
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
        <button
          type="button"
          aria-label="Grid view"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            viewMode === "grid" ? "bg-primary text-white" : "text-muted hover:text-foreground",
          )}
        >
          <AppstoreOutlined />
        </button>
        <button
          type="button"
          aria-label="List view"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-foreground",
          )}
        >
          <UnorderedListOutlined />
        </button>
      </div>
    </div>
  );
}

export default React.memo(ProjectsToolbar);
