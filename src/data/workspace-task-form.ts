import type {
  WorkspaceTaskPriority,
  WorkspaceTaskStatus,
} from "./workspace-tasks";

export type TaskFormAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  url?: string;
};

export type TaskFormValues = {
  title: string;
  projectId: string;
  status: WorkspaceTaskStatus;
  priority: WorkspaceTaskPriority;
  estimatedHours: number | null;
  description: string;
  assigneeId: string;
  dueDate: string;
  labels: string[];
  attachments: TaskFormAttachment[];
};

export type TaskAssigneeOption = {
  id: string;
  name: string;
  initials: string;
};

export const TASK_FORM_STATUS_OPTIONS: {
  value: WorkspaceTaskStatus;
  label: string;
  dot: string;
}[] = [
  { value: "todo", label: "Backlog", dot: "bg-slate-400" },
  { value: "in_progress", label: "In Progress", dot: "bg-primary" },
  { value: "review", label: "Review", dot: "bg-amber-500" },
  { value: "done", label: "Done", dot: "bg-emerald-500" },
];

export const TASK_FORM_PRIORITY_OPTIONS: {
  value: WorkspaceTaskPriority;
  label: string;
}[] = [
  { value: "critical", label: "Highest" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const TASK_LABEL_OPTIONS = ["Frontend", "Design", "Backend", "Bug", "QA", "Docs"] as const;

export const DEFAULT_TASK_FORM_VALUES: TaskFormValues = {
  title: "",
  projectId: "",
  status: "todo",
  priority: "medium",
  estimatedHours: null,
  description: "",
  assigneeId: "",
  dueDate: "",
  labels: [],
  attachments: [],
};

export function getTaskProjectLabel(
  projectId: string,
  projects?: Array<{ id: string; title: string }>,
) {
  return projects?.find((project) => project.id === projectId)?.title ?? "Project";
}

export function getTaskAssigneeById(
  assigneeId: string,
  assignees?: TaskAssigneeOption[],
) {
  return assignees?.find((option) => option.id === assigneeId) ?? null;
}

export function getTaskCreatePath(projectId?: string) {
  if (!projectId) return "/tasks/new";
  return `/tasks/new?project=${projectId}`;
}

export function getTaskDetailPath(taskId: string) {
  return `/tasks/${taskId}`;
}

export function getTaskEditPath(taskId: string) {
  return `/tasks/${taskId}/edit`;
}
