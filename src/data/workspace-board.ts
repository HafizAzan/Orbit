import { formatDate } from "../lib/helper";
import { getWorkspaceProjectDisplayTitle } from "../lib/workspace-project-display";
import type { ProjectTeamMember } from "./workspace-projects";
import { WORKSPACE_PROJECTS } from "./workspace-projects";
import {
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  WORKSPACE_TASKS,
  type WorkspaceTask,
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

const KANBAN_COLUMN_DEFINITIONS: {
  id: string;
  title: string;
  statuses: WorkspaceTaskStatus[];
}[] = [
  { id: "todo", title: "TODO", statuses: ["todo"] },
  { id: "in-progress", title: "IN PROGRESS", statuses: ["in_progress"] },
  { id: "review", title: "REVIEW", statuses: ["review"] },
  { id: "done", title: "DONE", statuses: ["done"] },
];

const ASSIGNEE_AVATAR_COLORS: Record<string, string> = {
  "sarah-jenkins": "bg-indigo-100 text-indigo-700",
  "michael-chen": "bg-sky-100 text-sky-700",
  "elena-rodriguez": "bg-violet-100 text-violet-700",
  "david-miller": "bg-emerald-100 text-emerald-700",
  "chloe-sterling": "bg-amber-100 text-amber-700",
};

function mapTaskPriority(priority: WorkspaceTaskPriority): KanbanTaskPriority {
  if (priority === "critical" || priority === "high") {
    return "high";
  }

  if (priority === "medium") {
    return "medium";
  }

  return "low";
}

function mapTaskToKanbanCard(task: WorkspaceTask): KanbanTask {
  return {
    id: task.id,
    title: task.title,
    priority: mapTaskPriority(task.priority),
    dueLabel: formatDate(task.dueDate, { year: undefined }),
    assignee: {
      id: task.assignee.id,
      name: task.assignee.name,
      initials: task.assignee.initials,
      avatarColor: ASSIGNEE_AVATAR_COLORS[task.assignee.id] ?? "bg-feature-sync text-primary",
    },
  };
}

export function getTasksForProject(projectId: string) {
  return WORKSPACE_TASKS.filter((task) => task.projectId === projectId);
}

export function getProjectKanbanBoard(projectId: string): WorkspaceKanbanBoard | null {
  const project = WORKSPACE_PROJECTS.find((item) => item.id === projectId);
  if (!project) {
    return null;
  }

  const projectName = getWorkspaceProjectDisplayTitle(project);
  const projectTasks = getTasksForProject(projectId);

  const columns: KanbanColumn[] = KANBAN_COLUMN_DEFINITIONS.map((column) => ({
    id: column.id,
    title: column.title,
    tasks: projectTasks
      .filter((task) => column.statuses.includes(task.status))
      .map(mapTaskToKanbanCard),
  }));

  return {
    id: `board-${projectId}`,
    projectId,
    projectName,
    title: `${projectName} Board`,
    teamMembers: project.members,
    columns,
  };
}

export function getAllProjectBoardSummaries(): ProjectBoardSummary[] {
  return WORKSPACE_PROJECTS.map((project) => {
    const tasks = getTasksForProject(project.id);

    return {
      projectId: project.id,
      projectName: getWorkspaceProjectDisplayTitle(project),
      title: `${getWorkspaceProjectDisplayTitle(project)} Board`,
      taskCount: tasks.length,
      inProgressCount: tasks.filter((task) => task.status === "in_progress").length,
      members: project.members,
    };
  });
}

export function getKanbanStatusLabel(status: WorkspaceTaskStatus) {
  return TASK_STATUS_CONFIG[status].label;
}

export function getKanbanPriorityLabel(priority: WorkspaceTaskPriority) {
  return TASK_PRIORITY_CONFIG[priority].label;
}
