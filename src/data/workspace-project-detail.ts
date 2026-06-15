import type { WorkspaceProject } from "./workspace-projects";
import { WORKSPACE_PROJECTS } from "./workspace-projects";

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
};

export type ProjectDiscussionMessage = {
  id: string;
  userName: string;
  message: string;
  timeAgo: string;
  avatarColor: string;
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

const PROJECT_DETAILS: Record<string, Omit<WorkspaceProjectDetail, keyof WorkspaceProject>> = {
  "1": {
    projectCode: "OMEGA-2024",
    phaseLabel: "Phase 2 Progress",
    tasksCompleted: 142,
    tasksTotal: 218,
    timeSpent: "84h 12m",
    remainingDays: 14,
    teamMembers: [
      { id: "1", name: "Sarah Jenkins", role: "Project Lead", avatarColor: "bg-indigo-100 text-indigo-700" },
      { id: "2", name: "Alex Martinez", role: "Infrastructure Eng.", avatarColor: "bg-sky-100 text-sky-700" },
      { id: "3", name: "David Lee", role: "Security Analyst", avatarColor: "bg-violet-100 text-violet-700" },
      { id: "4", name: "Maya Kapoor", role: "UI/UX Designer", avatarColor: "bg-emerald-100 text-emerald-700" },
    ],
    activities: [
      {
        id: "1",
        userName: "Sarah Jenkins",
        action: "updated the status to",
        target: "On Track",
        timeAgo: "2 hours ago",
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      {
        id: "2",
        userName: "Alex Martinez",
        action: "uploaded",
        target: "Design_v2_Final.fig",
        timeAgo: "5 hours ago",
        iconBg: "bg-sky-50",
        iconColor: "text-sky-600",
      },
      {
        id: "3",
        userName: "David Lee",
        action: "left a comment on",
        target: "Security Audit",
        timeAgo: "Yesterday at 4:32 PM",
        comment: "We need to finalize the encryption keys before the next deployment cycle.",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
      },
    ],
    attachments: [
      { id: "1", name: "Project_Spec_v4.pdf", size: "2.4 MB", date: "Oct 12, 2023", type: "pdf" },
      { id: "2", name: "Design_v2_Final.fig", size: "18.6 MB", date: "Oct 18, 2023", type: "design" },
    ],
    discussion: [
      {
        id: "1",
        userName: "Maya Kapoor",
        message: "I've updated the component library with the new purple tokens. Ready for review!",
        timeAgo: "10:45 AM",
        avatarColor: "bg-emerald-100 text-emerald-700",
      },
      {
        id: "2",
        userName: "Alex Martinez",
        message: "Looks great! I'll integrate these into the staging environment this afternoon.",
        timeAgo: "11:02 AM",
        avatarColor: "bg-sky-100 text-sky-700",
      },
    ],
  },
};

function buildDefaultDetail(project: WorkspaceProject): Omit<WorkspaceProjectDetail, keyof WorkspaceProject> {
  return {
    projectCode: project.id.padStart(4, "0").toUpperCase(),
    phaseLabel: "Current Phase Progress",
    tasksCompleted: Math.round((project.progress / 100) * project.taskCount),
    tasksTotal: project.taskCount,
    timeSpent: `${Math.round(project.progress * 1.2)}h 30m`,
    remainingDays: 21,
    teamMembers: project.members.map((member, index) => ({
      id: member.id,
      name: member.name,
      role: index === 0 ? "Project Lead" : "Team Member",
      avatarColor: member.avatarColor,
    })),
    activities: [
      {
        id: "1",
        userName: project.members[0]?.name ?? "Team Member",
        action: "updated project progress to",
        target: `${project.progress}%`,
        timeAgo: "3 hours ago",
        iconBg: project.iconBg,
        iconColor: project.iconColor,
      },
    ],
    attachments: [
      {
        id: "1",
        name: `${project.title.replace(/\s+/g, "_")}_Brief.pdf`,
        size: "1.8 MB",
        date: "Oct 01, 2024",
        type: "pdf",
      },
    ],
    discussion: [
      {
        id: "1",
        userName: project.members[0]?.name ?? "Team Member",
        message: "Kickoff complete. Let's sync on milestones tomorrow morning.",
        timeAgo: "9:15 AM",
        avatarColor: project.members[0]?.avatarColor ?? "bg-indigo-100 text-indigo-700",
      },
    ],
  };
}

export function getWorkspaceProjectById(projectId: string) {
  return WORKSPACE_PROJECTS.find((project) => project.id === projectId) ?? null;
}

export function getWorkspaceProjectDetail(projectId: string): WorkspaceProjectDetail | null {
  const project = getWorkspaceProjectById(projectId);
  if (!project) return null;

  const detail = PROJECT_DETAILS[projectId] ?? buildDefaultDetail(project);

  return {
    ...project,
    ...detail,
    title: projectId === "1" ? "Project Omega" : project.title,
    description:
      projectId === "1"
        ? "Enterprise-scale cloud migration initiative focused on high-availability clusters and zero-downtime deployment across global regions."
        : project.description,
  };
}

export function getProjectDetailPath(projectId: string) {
  return `/projects/${projectId}`;
}

export function getProjectBoardPath(projectId: string) {
  return `/projects/${projectId}/board`;
}
