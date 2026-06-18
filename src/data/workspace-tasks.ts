export type WorkspaceTaskStatus = "todo" | "in_progress" | "review" | "done";
export type WorkspaceTaskPriority = "critical" | "high" | "medium" | "low";

export type WorkspaceTaskAssignee = {
  id: string;
  name: string;
  initials: string;
};

export type WorkspaceTask = {
  id: string;
  taskCode: string;
  title: string;
  project: string;
  projectId: string;
  assignee: WorkspaceTaskAssignee;
  priority: WorkspaceTaskPriority;
  status: WorkspaceTaskStatus;
  dueDate: string;
};

export const WORKSPACE_TASKS_PAGE_SIZE = 10;

export const TASK_STATUS_CONFIG: Record<
  WorkspaceTaskStatus,
  { label: string; dot: string; badgeClass: string }
> = {
  todo: {
    label: "TODO",
    dot: "bg-slate-400",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
  },
  in_progress: {
    label: "IN PROGRESS",
    dot: "bg-primary",
    badgeClass: "border-primary/20 bg-feature-sync text-primary",
  },
  review: {
    label: "REVIEW",
    dot: "bg-amber-500",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  done: {
    label: "DONE",
    dot: "bg-emerald-500",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export const TASK_PRIORITY_CONFIG: Record<
  WorkspaceTaskPriority,
  { label: string; badgeClass: string }
> = {
  critical: {
    label: "CRITICAL",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
  },
  high: {
    label: "HIGH",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
  },
  medium: {
    label: "MEDIUM",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
  },
  low: {
    label: "LOW",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

export const TASK_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
] as const;

export const TASK_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All priorities" },
  ...Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
] as const;

export const TASK_DUE_DATE_FILTER_OPTIONS = [
  { value: "all", label: "Any due date" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

export type TaskTableFilters = {
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  project: string;
};

export const DEFAULT_TASK_TABLE_FILTERS: TaskTableFilters = {
  status: "all",
  priority: "all",
  assignee: "all",
  dueDate: "all",
  project: "all",
};
