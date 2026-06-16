import type {
  WorkspaceTask,
  WorkspaceTaskPriority,
  WorkspaceTaskStatus,
} from "./workspace-tasks";
import { TASK_ASSIGNEE_FILTER_OPTIONS, WORKSPACE_TASKS } from "./workspace-tasks";
import { WORKSPACE_PROJECTS } from "./workspace-projects";

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

export const TASK_ASSIGNEE_OPTIONS: TaskAssigneeOption[] = TASK_ASSIGNEE_FILTER_OPTIONS.filter(
  (option) => option.value !== "all",
).map((option) => ({
  id: option.value,
  name: option.label,
  initials: option.label
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase(),
}));

export const TASK_PROJECT_OPTIONS = WORKSPACE_PROJECTS.map((project) => ({
  value: project.id,
  label: project.id === "1" ? "Project Omega" : project.title,
}));

export const DEFAULT_TASK_FORM_VALUES: TaskFormValues = {
  title: "",
  projectId: "1",
  status: "todo",
  priority: "critical",
  estimatedHours: 4,
  description: "",
  assigneeId: "sarah-jenkins",
  dueDate: "",
  labels: ["Frontend", "Design"],
};

const TASK_FORM_DETAILS: Record<string, Partial<Pick<TaskFormValues, "description" | "estimatedHours" | "labels">>> = {
  "1": {
    description: "Refactor the authentication flow to support SSO and session refresh tokens.",
    estimatedHours: 8,
    labels: ["Frontend", "Backend"],
  },
  "2": {
    description: "Document all public API endpoints with request/response examples.",
    estimatedHours: 6,
    labels: ["Docs"],
  },
};

export function getWorkspaceTaskById(taskId: string) {
  return WORKSPACE_TASKS.find((task) => task.id === taskId) ?? null;
}

export function getTaskProjectLabel(projectId: string) {
  return TASK_PROJECT_OPTIONS.find((option) => option.value === projectId)?.label ?? "Project";
}

export function getTaskAssigneeById(assigneeId: string) {
  return TASK_ASSIGNEE_OPTIONS.find((option) => option.id === assigneeId) ?? null;
}

export function mapTaskToFormValues(task: WorkspaceTask): TaskFormValues {
  const details = TASK_FORM_DETAILS[task.id];

  return {
    title: task.title,
    projectId: task.projectId,
    status: task.status,
    priority: task.priority,
    estimatedHours: details?.estimatedHours ?? 4,
    description: details?.description ?? "",
    assigneeId: task.assignee.id,
    dueDate: task.dueDate,
    labels: details?.labels ?? ["Frontend"],
  };
}

export function getTaskCreatePath(projectId?: string) {
  if (!projectId) return "/tasks/new";
  return `/tasks/new?project=${projectId}`;
}

export function getTaskEditPath(taskId: string) {
  return `/tasks/${taskId}/edit`;
}
