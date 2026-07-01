import type { WorkspaceProject } from "./workspace-projects";

export type ProjectDetailMember = {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
};

export type ProjectActivityItem = {
  id: string;
  userName: string;
  action: string;
  target?: string;
  timeAgo: string;
  comment?: string;
  iconBg: string;
  iconColor: string;
};

export type ProjectAttachmentItem = {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "pdf" | "design" | "doc";
  url?: string;
};

export type ProjectDiscussionMessage = {
  id: string;
  userName: string;
  message: string;
  timeAgo: string;
  avatarColor: string;
  authorId?: string;
};

export type WorkspaceProjectDetail = WorkspaceProject & {
  projectCode: string;
  phaseLabel: string;
  tasksCompleted: number;
  tasksTotal: number;
  timeSpent: string;
  remainingDays: number;
  teamMembers: ProjectDetailMember[];
  activities: ProjectActivityItem[];
  attachments: ProjectAttachmentItem[];
  discussion: ProjectDiscussionMessage[];
};

export function getProjectDetailPath(projectId: string) {
  return `/projects/${projectId}`;
}

export function getProjectBoardPath(projectId: string) {
  return `/projects/${projectId}/board`;
}

export function getProjectThemePath(projectId: string) {
  return `/projects/${projectId}/theme`;
}

/** @deprecated Use getProjectThemePath */
export function getProjectSettingsPath(projectId: string) {
  return getProjectThemePath(projectId);
}
