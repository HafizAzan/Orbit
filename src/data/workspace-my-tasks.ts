import type { WorkspaceTaskAssignee, WorkspaceTaskPriority, WorkspaceTaskStatus } from "./workspace-tasks";
import { TASK_PRIORITY_CONFIG, TASK_STATUS_CONFIG } from "./workspace-tasks";

export type MyTaskBucket = "due_today" | "assigned" | "upcoming" | "completed";

export type MyTaskIcon = "rocket" | "chart" | "shield" | "default";

export type MyTaskCollaborator = WorkspaceTaskAssignee & {
  avatarColor?: string;
};

export type MyTask = {
  id: string;
  taskCode: string;
  title: string;
  description?: string;
  project: string;
  projectId: string;
  assignee: WorkspaceTaskAssignee;
  collaborators?: MyTaskCollaborator[];
  priority: WorkspaceTaskPriority;
  status: WorkspaceTaskStatus;
  dueDate: string;
  dueTime?: string;
  bucket: MyTaskBucket;
  icon?: MyTaskIcon;
  tags?: string[];
};

export type MyTasksFilters = {
  status: string;
  priority: string;
  project: string;
};

export const DEFAULT_MY_TASKS_FILTERS: MyTasksFilters = {
  status: "all",
  priority: "all",
  project: "all",
};

export const MY_TASKS_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export const MY_TASKS_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export function buildMyTasksProjectFilterOptions(tasks: MyTask[]) {
  const projects = new Map<string, string>();
  tasks.forEach((task) => projects.set(task.projectId, task.project));

  return [
    { value: "all", label: "All" },
    ...Array.from(projects.entries()).map(([value, label]) => ({ value, label })),
  ];
}
