import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import createWorkspaceTaskTableColumns from "../../../columns/workspace-task-table-columns";
import {
  DEFAULT_TASK_TABLE_FILTERS,
  TASK_ASSIGNEE_FILTER_OPTIONS,
  TASK_DUE_DATE_FILTER_OPTIONS,
  TASK_PRIORITY_CONFIG,
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_PROJECT_FILTER_OPTIONS,
  TASK_STATUS_CONFIG,
  TASK_STATUS_FILTER_OPTIONS,
  WORKSPACE_TASKS,
  WORKSPACE_TASKS_PAGE_SIZE,
  type TaskTableFilters,
  type WorkspaceTask,
} from "../../../data/workspace-tasks";
import { matchesSearchQuery, paginateItems } from "../../../lib/helper";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";

function countActiveTaskFilters(filters: TaskTableFilters) {
  return Object.values(filters).filter((value) => value !== "all").length;
}

function matchesDueDateFilter(dueDate: string, filter: string) {
  if (filter === "all") return true;

  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  if (filter === "overdue") {
    return dueDay < today;
  }

  if (filter === "today") {
    return dueDay.getTime() === today.getTime();
  }

  if (filter === "week") {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return dueDay >= today && dueDay <= weekEnd;
  }

  if (filter === "month") {
    const monthEnd = new Date(today);
    monthEnd.setDate(monthEnd.getDate() + 30);
    return dueDay >= today && dueDay <= monthEnd;
  }

  return true;
}

function matchesTaskFilters(task: WorkspaceTask, filters: TaskTableFilters) {
  if (filters.status !== "all" && task.status !== filters.status) return false;
  if (filters.priority !== "all" && task.priority !== filters.priority) return false;
  if (filters.assignee !== "all" && task.assignee.id !== filters.assignee) return false;
  if (filters.project !== "all" && task.projectId !== filters.project) return false;
  if (!matchesDueDateFilter(task.dueDate, filters.dueDate)) return false;
  return true;
}

type TasksTableProps = {
  data?: WorkspaceTask[];
  emptyAction?: React.ReactNode;
};

function TasksTable({ data = WORKSPACE_TASKS, emptyAction }: TasksTableProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TaskTableFilters>(DEFAULT_TASK_TABLE_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = useMemo(() => createWorkspaceTaskTableColumns(), []);
  const activeFilterCount = countActiveTaskFilters(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((task) => {
      if (!matchesTaskFilters(task, filters)) return false;
      if (!query) return true;

      return (
        matchesSearchQuery(task.taskCode, query) ||
        matchesSearchQuery(task.title, query) ||
        matchesSearchQuery(task.project, query) ||
        matchesSearchQuery(task.assignee.name, query)
      );
    });
  }, [data, filters, search]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, filters]);

  const paginatedData = useMemo(
    () => paginateItems(filteredData, page, WORKSPACE_TASKS_PAGE_SIZE),
    [filteredData, page],
  );

  const handleFilterChange = (key: keyof TaskTableFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_TASK_TABLE_FILTERS);
    setSearch("");
  };

  const resultsSummary = (
    <span className="text-sm text-muted">
      Showing{" "}
      <span className="font-semibold text-foreground">
        {filteredData.length === 0 ? 0 : (page - 1) * WORKSPACE_TASKS_PAGE_SIZE + 1}-
        {Math.min(page * WORKSPACE_TASKS_PAGE_SIZE, filteredData.length)}
      </span>{" "}
      of <span className="font-semibold text-foreground">{filteredData.length}</span> tasks
    </span>
  );

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-muted" />}
            placeholder="Search tasks, IDs, or assignees..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-md rounded-xl! bg-background!"
          />

          {activeFilterCount > 0 || search.trim() ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <CloseOutlined className="text-[10px]" />
              Clear all
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Select
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={TASK_STATUS_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            className="w-full"
          />
          <Select
            value={filters.priority}
            onChange={(value) => handleFilterChange("priority", value)}
            options={TASK_PRIORITY_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            className="w-full"
          />
          <Select
            value={filters.assignee}
            onChange={(value) => handleFilterChange("assignee", value)}
            options={TASK_ASSIGNEE_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            className="w-full"
          />
          <Select
            value={filters.dueDate}
            onChange={(value) => handleFilterChange("dueDate", value)}
            options={TASK_DUE_DATE_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            className="w-full"
          />
          <Select
            value={filters.project}
            onChange={(value) => handleFilterChange("project", value)}
            options={TASK_PROJECT_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            className="w-full"
          />
        </div>

        {activeFilterCount > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {filters.status !== "all" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-medium text-primary">
                Status: {TASK_STATUS_CONFIG[filters.status as WorkspaceTask["status"]]?.label}
              </span>
            ) : null}
            {filters.priority !== "all" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-medium text-primary">
                Priority: {TASK_PRIORITY_CONFIG[filters.priority as WorkspaceTask["priority"]]?.label}
              </span>
            ) : null}
            {filters.assignee !== "all" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-medium text-primary">
                Assignee: {TASK_ASSIGNEE_FILTER_OPTIONS.find((option) => option.value === filters.assignee)?.label}
              </span>
            ) : null}
            {filters.project !== "all" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-medium text-primary">
                Project: {TASK_PROJECT_FILTER_OPTIONS.find((option) => option.value === filters.project)?.label}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <Table<WorkspaceTask>
        rowKey="id"
        columns={columns}
        dataSource={paginatedData}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        }}
        scroll={{ x: 1100 }}
        pagination={false}
        wrapperClassName="border-0! rounded-none! shadow-none!"
        emptyTitle="No tasks found"
        emptyDescription={
          hasQuery
            ? "Try adjusting your search or filters to find what you are looking for."
            : "Get started by creating your first task for the team."
        }
        emptyAction={emptyAction}
      />

      {filteredData.length > 0 ? (
        <TablePaginationFooter
          summary={resultsSummary}
          current={page}
          pageSize={WORKSPACE_TASKS_PAGE_SIZE}
          total={filteredData.length}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}

export default React.memo(TasksTable);
