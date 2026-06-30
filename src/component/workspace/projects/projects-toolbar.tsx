import {
  AppstoreOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Select } from "antd";
import React from "react";
import type { ProjectsViewMode } from "../../../data/workspace-projects";
import {
  PROJECT_PRIORITY_FILTER_OPTIONS,
  PROJECT_STATUS_FILTER_OPTIONS,
} from "../../../data/workspace-projects";
import { cn } from "../../../lib/utils";
import { Text } from "../../ui/typography";

const TOOLBAR_CONTROL_CLASS =
  "h-8 min-h-8 rounded-lg border border-border bg-background shadow-none";

const TOOLBAR_SELECT_CLASS =
  "[&_.ant-select-selector]:!h-8 [&_.ant-select-selector]:!min-h-8 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-lg";

type ProjectsToolbarProps = {
  statusFilter: string;
  priorityFilter: string;
  teamFilter: string;
  teamFilterOptions: Array<{ value: string; label: string }>;
  viewMode: ProjectsViewMode;
  totalProjects: number;
  selectedCount: number;
  allSelected: boolean;
  indeterminate: boolean;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  onViewModeChange: (mode: ProjectsViewMode) => void;
  onSelectAllChange: (checked: boolean) => void;
  canSelect?: boolean;
};

function ProjectsToolbar({
  statusFilter,
  priorityFilter,
  teamFilter,
  teamFilterOptions,
  viewMode,
  totalProjects,
  selectedCount,
  allSelected,
  indeterminate,
  onStatusChange,
  onPriorityChange,
  onTeamChange,
  onViewModeChange,
  onSelectAllChange,
  canSelect = false,
}: ProjectsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {canSelect ? (
          <label
            className={cn(
              TOOLBAR_CONTROL_CLASS,
              "inline-flex min-w-[132px] cursor-pointer items-center gap-2.5 px-3",
              totalProjects === 0 && "cursor-not-allowed opacity-50",
            )}
          >
            <Checkbox
              checked={allSelected}
              indeterminate={indeterminate}
              disabled={totalProjects === 0}
              onChange={(event) => onSelectAllChange(event.target.checked)}
              className="m-0! leading-none [&_.ant-checkbox]:top-0"
            />
            <Text as="span" size="sm" weight="medium" className="whitespace-nowrap">
              Select all
              {selectedCount > 0 ? (
                <Text as="span" color="muted">
                  {" "}
                  ({selectedCount}/{totalProjects})
                </Text>
              ) : null}
            </Text>
          </label>
        ) : null}

        <Select
          value={statusFilter}
          onChange={onStatusChange}
          className={cn("min-w-[180px]", TOOLBAR_SELECT_CLASS)}
          options={PROJECT_STATUS_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Status: ${option.label}`,
          }))}
        />
        <Select
          value={priorityFilter}
          onChange={onPriorityChange}
          className={cn("min-w-[150px]", TOOLBAR_SELECT_CLASS)}
          options={PROJECT_PRIORITY_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Priority: ${option.label}`,
          }))}
          suffixIcon={<ExclamationCircleOutlined className="text-muted!" />}
        />
        <Select
          value={teamFilter}
          onChange={onTeamChange}
          className={cn("min-w-[170px]", TOOLBAR_SELECT_CLASS)}
          options={teamFilterOptions.map((option) => ({
            value: option.value,
            label: `Team: ${option.label}`,
          }))}
          suffixIcon={<TeamOutlined className="text-muted!" />}
        />
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
        <Button
          type={viewMode === "grid" ? "primary" : "text"}
          aria-label="Grid view"
          onClick={() => onViewModeChange("grid")}
          icon={<AppstoreOutlined />}
          className="h-9 w-9 rounded-lg!"
        />
        <Button
          type={viewMode === "list" ? "primary" : "text"}
          aria-label="List view"
          onClick={() => onViewModeChange("list")}
          icon={<UnorderedListOutlined />}
          className="h-9 w-9 rounded-lg!"
        />
      </div>
    </div>
  );
}

export default React.memo(ProjectsToolbar);
