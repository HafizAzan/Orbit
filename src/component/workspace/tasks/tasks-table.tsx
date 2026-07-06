import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createWorkspaceTaskTableColumns from "../../../columns/workspace-task-table-columns";
import { getTaskDetailPath, getTaskEditPath } from "../../../data/workspace-task-form";
import useWorkspacePermissions from "../../../hooks/use-workspace-permissions";
import { useIsDarkAppTheme } from "../../../lib/app-ui-theme-utils";
import { createWorkspaceNavState } from "../../../lib/workspace-navigation";
import { matchesSearchQuery, paginateItems, pluralize } from "../../../lib/helper";
import { toast } from "../../../lib/toast";
import { ConfirmModal } from "../../ui/modal";
import {
  DEFAULT_TASK_TABLE_FILTERS,
  TASK_DUE_DATE_FILTER_OPTIONS,
  TASK_PRIORITY_CONFIG,
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_STATUS_CONFIG,
  TASK_STATUS_FILTER_OPTIONS,
  WORKSPACE_TASKS_PAGE_SIZE,
  type TaskTableFilters,
  type WorkspaceTask,
} from "../../../data/workspace-tasks";
import Table from "../../ui/table";
import TablePaginationFooter from "../../ui/table-pagination-footer";
import BulkDeleteTasksButton from "./bulk-delete-tasks-button";
import { Text } from "../../ui/typography";

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
  data: WorkspaceTask[];
  emptyAction?: React.ReactNode;
  onBulkDelete?: (taskIds: string[]) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
};

function TasksTable({ data, emptyAction, onBulkDelete, onDeleteTask, serverPagination }: TasksTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = useIsDarkAppTheme();
  const { can } = useWorkspacePermissions();
  const canEditTask = can("task.edit");
  const canDeleteAnyTask = can("task.delete_any");
  const [tasks, setTasks] = useState(data);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TaskTableFilters>(DEFAULT_TASK_TABLE_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pendingDeleteTask, setPendingDeleteTask] = useState<WorkspaceTask | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const projectFilterOptions = useMemo(() => {
    const uniqueProjects = new Map<string, string>();
    tasks.forEach((task) => uniqueProjects.set(task.projectId, task.project));

    return [
      { value: "all", label: "All projects" },
      ...Array.from(uniqueProjects.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [tasks]);

  const assigneeFilterOptions = useMemo(() => {
    const uniqueAssignees = new Map<string, string>();
    tasks.forEach((task) => uniqueAssignees.set(task.assignee.id, task.assignee.name));

    return [
      { value: "all", label: "All assignees" },
      ...Array.from(uniqueAssignees.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [tasks]);

  const selectedCount = selectedRowKeys.length;

  const handleView = useCallback(
    (record: WorkspaceTask) => {
      navigate(getTaskDetailPath(record.id), createWorkspaceNavState(location.pathname));
    },
    [location.pathname, navigate],
  );

  const handleEdit = useCallback(
    (record: WorkspaceTask) => {
      navigate(getTaskEditPath(record.id), createWorkspaceNavState(location.pathname));
    },
    [location.pathname, navigate],
  );

  const handleDelete = useCallback((record: WorkspaceTask) => {
    setPendingDeleteTask(record);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteTask) return;

    setDeleteLoading(true);

    try {
      if (onDeleteTask) {
        await onDeleteTask(pendingDeleteTask.id);
      } else {
        setTasks((current) => current.filter((task) => task.id !== pendingDeleteTask.id));
        toast.success(`Task ${pendingDeleteTask.taskCode} deleted successfully`);
      }

      setSelectedRowKeys((current) => current.filter((key) => key !== pendingDeleteTask.id));
      setPendingDeleteTask(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [onDeleteTask, pendingDeleteTask]);

  const columns = useMemo(
    () =>
      createWorkspaceTaskTableColumns({
        onView: handleView,
        onEdit: canEditTask ? handleEdit : undefined,
        onDelete: canDeleteAnyTask ? handleDelete : undefined,
        canEdit: canEditTask,
        canDelete: canDeleteAnyTask,
        isDark,
      }),
    [canDeleteAnyTask, canEditTask, handleDelete, handleEdit, handleView, isDark],
  );
  const activeFilterCount = countActiveTaskFilters(filters);
  const hasQuery = Boolean(search.trim()) || activeFilterCount > 0;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      if (!matchesTaskFilters(task, filters)) return false;
      if (!query) return true;

      return (
        matchesSearchQuery(task.taskCode, query) ||
        matchesSearchQuery(task.title, query) ||
        matchesSearchQuery(task.project, query) ||
        matchesSearchQuery(task.assignee.name, query)
      );
    });
  }, [filters, search, tasks]);

  useEffect(() => {
    setPage(1);
    setSelectedRowKeys([]);
  }, [search, filters]);

  const paginatedData = useMemo(() => {
    if (serverPagination) {
      return filteredData;
    }

    return paginateItems(filteredData, page, WORKSPACE_TASKS_PAGE_SIZE);
  }, [filteredData, page, serverPagination]);

  const paginationPage = serverPagination?.page ?? page;
  const paginationPageSize = serverPagination?.pageSize ?? WORKSPACE_TASKS_PAGE_SIZE;
  const paginationTotal = serverPagination?.total ?? filteredData.length;
  const handlePageChange = serverPagination?.onChange ?? setPage;

  const handleFilterChange = (key: keyof TaskTableFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_TASK_TABLE_FILTERS);
    setSearch("");
  };

  const handleBulkDelete = useCallback(async () => {
    const taskIds = selectedRowKeys.map(String);

    if (onBulkDelete) {
      await onBulkDelete(taskIds);
      setSelectedRowKeys([]);
      return;
    }

    setTasks((current) => current.filter((task) => !selectedRowKeys.includes(task.id)));
    setSelectedRowKeys([]);
    toast.success(`${taskIds.length} ${pluralize(taskIds.length, "task")} deleted successfully`);
  }, [onBulkDelete, selectedRowKeys]);

  const resultsSummary = (
    <Text as="span" size="sm" color="muted">
      Showing{" "}
      <Text as="span" weight="semibold">
        {paginationTotal === 0 ? 0 : (paginationPage - 1) * paginationPageSize + 1}-
        {Math.min(paginationPage * paginationPageSize, paginationTotal)}
      </Text>{" "}
      of <Text as="span" weight="semibold">{paginationTotal}</Text> tasks
    </Text>
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
            className="w-full max-w-md rounded-xl! bg-background!"
          />

          <div className="flex flex-wrap items-center gap-3">
            {selectedCount > 0 ? (
              <BulkDeleteTasksButton selectedCount={selectedCount} onDelete={handleBulkDelete} />
            ) : null}

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
            options={assigneeFilterOptions}
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
            options={projectFilterOptions}
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
                Assignee: {assigneeFilterOptions.find((option) => option.value === filters.assignee)?.label}
              </span>
            ) : null}
            {filters.project !== "all" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-feature-sync px-3 py-1 text-xs font-medium text-primary">
                Project: {projectFilterOptions.find((option) => option.value === filters.project)?.label}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <Table<WorkspaceTask>
        rowKey="id"
        columns={columns}
        dataSource={paginatedData}
        rowSelection={
          canDeleteAnyTask
            ? {
                type: "checkbox",
                selectedRowKeys,
                onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
              }
            : undefined
        }
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

      {paginationTotal > 0 ? (
        <TablePaginationFooter
          summary={resultsSummary}
          current={paginationPage}
          pageSize={paginationPageSize}
          total={paginationTotal}
          onChange={handlePageChange}
        />
      ) : null}

      <ConfirmModal
        open={pendingDeleteTask !== null}
        onClose={() => setPendingDeleteTask(null)}
        onConfirm={handleConfirmDelete}
        title="Delete task"
        description={
          pendingDeleteTask ? (
            <>
              Are you sure you want to delete{" "}
              <Text as="span" weight="semibold">{pendingDeleteTask.taskCode}</Text> —{" "}
              {pendingDeleteTask.title}? This action cannot be undone.
            </>
          ) : null
        }
        confirmText="Delete task"
        confirmDanger
        confirmLoading={deleteLoading}
        icon={<DeleteOutlined />}
      />
    </div>
  );
}

export default React.memo(TasksTable);
