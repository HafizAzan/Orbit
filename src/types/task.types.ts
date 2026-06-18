import type {
  WorkspaceTask,
  WorkspaceTaskPriority,
  WorkspaceTaskStatus,
} from "../data/workspace-tasks";

export type ApiTaskAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
};

export type ApiWorkspaceTask = {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  projectId: string;
  project: string;
  projectKey: string;
  assignee: {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
  } | null;
  priority: WorkspaceTaskPriority;
  status: WorkspaceTaskStatus;
  dueDate: string | null;
  estimatedHours: number | null;
  labels: string[];
  attachments: ApiTaskAttachment[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  projectId: string;
  title: string;
  description?: string;
  status?: WorkspaceTaskStatus;
  priority?: WorkspaceTaskPriority;
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number | null;
  labels?: string[];
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  status?: WorkspaceTaskStatus;
  priority?: WorkspaceTaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  labels?: string[];
};

export type WorkspaceDashboardResponse = {
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    trend: string;
    trendType: "up" | "down" | "stable";
    icon: "projects" | "tasks" | "team" | "completed";
    iconBg: string;
  }>;
  velocity: Array<{ date: string; completed: number }>;
  taskStatus: Array<{ id: string; label: string; count: number; color: string }>;
  activeProjects: Array<{
    id: string;
    name: string;
    updatedAt: string;
    progress: number;
    iconBg: string;
  }>;
  criticalDeadlines: Array<{
    id: string;
    title: string;
    subtitle: string;
    month: string;
    day: string;
    priority?: "high";
  }>;
  activity: unknown[];
};

export type WorkspaceReportsResponse = {
  summary: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    activeProjects: number;
  };
  tasksByProject: Array<{
    projectId: string;
    projectName: string;
    total: number;
    completed: number;
    inProgress: number;
  }>;
  tasksByPriority: Array<{ priority: string; count: number }>;
  taskStatus: Array<{ id: string; label: string; count: number; color: string }>;
};

export type ProjectBoardSummary = {
  projectId: string;
  projectName: string;
  title: string;
  taskCount: number;
  inProgressCount: number;
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatarColor: string;
    projectRole: string;
  }>;
};

export type WorkspaceKanbanBoardResponse = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatarColor: string;
  }>;
  columns: Array<{
    id: string;
    title: string;
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      priority: "high" | "medium" | "low";
      dueLabel: string;
      assignee: {
        id: string;
        name: string;
        initials: string;
        avatarColor: string;
      };
    }>;
  }>;
};

export function mapApiTaskToWorkspaceTask(task: ApiWorkspaceTask): WorkspaceTask {
  return {
    id: task.id,
    taskCode: task.taskCode,
    title: task.title,
    project: task.project,
    projectId: task.projectId,
    assignee: task.assignee ?? { id: "unassigned", name: "Unassigned", initials: "UA" },
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ?? new Date().toISOString().slice(0, 10),
  };
}

export function mapApiTaskToFormValues(task: ApiWorkspaceTask): import("../data/workspace-task-form").TaskFormValues {
  return {
    title: task.title,
    projectId: task.projectId,
    status: task.status,
    priority: task.priority,
    estimatedHours: task.estimatedHours,
    description: task.description,
    assigneeId: task.assignee?.id ?? "",
    dueDate: task.dueDate
      ? String(task.dueDate).slice(0, 10)
      : "",
    labels: task.labels ?? [],
    attachments: (task.attachments ?? []).map((attachment) => ({
      id: attachment.id,
      name: attachment.fileName,
      size: attachment.size,
      type: attachment.mimeType,
      url: attachment.url,
    })),
  };
}

export function mapApiTaskToMyTask(task: ApiWorkspaceTask): import("../data/workspace-my-tasks").MyTask {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let bucket: import("../data/workspace-my-tasks").MyTaskBucket = "assigned";

  if (task.status === "done") {
    bucket = "completed";
  } else if (task.dueDate) {
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() <= today.getTime()) {
      bucket = "due_today";
    } else {
      bucket = "upcoming";
    }
  }

  return {
    id: task.id,
    taskCode: task.taskCode,
    title: task.title,
    description: task.description,
    project: task.project,
    projectId: task.projectId,
    assignee: task.assignee ?? { id: "unassigned", name: "Unassigned", initials: "UA" },
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ?? today.toISOString().slice(0, 10),
    bucket,
    icon: "default",
  };
}

export function mapApiBoardToKanbanBoard(board: WorkspaceKanbanBoardResponse): import("../data/workspace-board").WorkspaceKanbanBoard {
  return {
    id: board.id,
    projectId: board.projectId,
    projectName: board.projectName,
    title: board.title,
    teamMembers: board.teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      avatarColor: member.avatarColor,
    })),
    columns: board.columns,
  };
}
