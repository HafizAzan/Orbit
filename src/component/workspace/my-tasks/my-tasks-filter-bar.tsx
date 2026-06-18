import { Select } from "antd";
import React from "react";
import {
  MY_TASKS_PRIORITY_FILTER_OPTIONS,
  MY_TASKS_STATUS_FILTER_OPTIONS,
  type MyTasksFilters,
} from "../../../data/workspace-my-tasks";
import { formatMyTasksRemainingLabel } from "../../../lib/workspace-my-tasks-utils";

type MyTasksFilterBarProps = {
  filters: MyTasksFilters;
  remainingCount: number;
  projectOptions: Array<{ value: string; label: string }>;
  onChange: (key: keyof MyTasksFilters, value: string) => void;
};

function MyTasksFilterBar({ filters, remainingCount, projectOptions, onChange }: MyTasksFilterBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          value={filters.status}
          onChange={(value) => onChange("status", value)}
          options={MY_TASKS_STATUS_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Status: ${option.label}`,
          }))}
          className="w-full"
        />
        <Select
          value={filters.priority}
          onChange={(value) => onChange("priority", value)}
          options={MY_TASKS_PRIORITY_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: `Priority: ${option.label}`,
          }))}
          className="w-full"
        />
        <Select
          value={filters.project}
          onChange={(value) => onChange("project", value)}
          options={projectOptions.map((option) => ({
            value: option.value,
            label: `Project: ${option.label}`,
          }))}
          className="w-full"
        />
      </div>

      <p className="text-sm font-medium text-muted lg:shrink-0">{formatMyTasksRemainingLabel(remainingCount)}</p>
    </div>
  );
}

export default React.memo(MyTasksFilterBar);
