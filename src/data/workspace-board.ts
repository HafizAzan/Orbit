import type { ProjectTeamMember } from "./workspace-projects";
import {
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  type WorkspaceTaskPriority,
  type WorkspaceTaskStatus,
} from "./workspace-tasks";

export type KanbanTaskPriority = "high" | "medium" | "low";

export type KanbanAssignee = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
};

export type KanbanTask = {
  id: string;
  title: string;
  description?: string;
  priority: KanbanTaskPriority;
  dueLabel: string;
  assignee: KanbanAssignee;
};

export type KanbanColumn = {
  id: string;
  title: string;
  tasks: KanbanTask[];
};

export type WorkspaceKanbanBoard = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  teamMembers: ProjectTeamMember[];
  columns: KanbanColumn[];
};

export type ProjectBoardSummary = {
  projectId: string;
  projectName: string;
  title: string;
  taskCount: number;
  inProgressCount: number;
  members: ProjectTeamMember[];
};

export const KANBAN_PRIORITY_CONFIG: Record<
  KanbanTaskPriority,
  { label: string; badgeClass: string }
> = {
  high: {
    label: "HIGH",
    badgeClass: "bg-red-50 text-red-600 border-red-100",
  },
  medium: {
    label: "MEDIUM",
    badgeClass: "bg-violet-50 text-violet-600 border-violet-100",
  },
  low: {
    label: "LOW",
    badgeClass: "bg-sky-50 text-sky-600 border-sky-100",
  },
};

export function getKanbanStatusLabel(status: WorkspaceTaskStatus) {
  return TASK_STATUS_CONFIG[status].label;
}

export function getKanbanPriorityLabel(priority: WorkspaceTaskPriority) {
  return TASK_PRIORITY_CONFIG[priority].label;
}
