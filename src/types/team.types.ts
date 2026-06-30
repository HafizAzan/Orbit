import type {
  TeamInvitePayload,
  TeamInviteRole,
  TeamMember,
  TeamMemberDepartment,
  TeamMemberRole,
  TeamMemberStatus,
} from "../data/workspace-teams";

export type ApiTeamMember = {
  id: string;
  name: string;
  email: string;
  department: TeamMemberDepartment;
  projects: number;
  joinedDate: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  lastActive: string;
};

export type ApiTeamMemberProjectDetail = {
  projectId: string;
  projectKey: string;
  projectName: string;
  projectRole: string;
  assignedTasks: number;
  completedTasks: number;
};

export type ApiTeamMemberDetail = ApiTeamMember & {
  totalAssignedTasks: number;
  completedAssignedTasks: number;
  projectsDetail: ApiTeamMemberProjectDetail[];
};

export type ApiTeamStats = {
  totalSeats: {
    used: number;
    total: number;
  };
  pendingInvites: number;
  activeToday: number;
  activeTodayTrend: string;
};

export type InviteTeamMemberRequest = {
  email: string;
  name?: string;
  role: TeamInviteRole;
  department: TeamMemberDepartment;
  message?: string;
  sendWelcomeEmail?: boolean;
};

export type UpdateTeamMemberRoleRequest = {
  role: TeamInviteRole;
};

export type UpdateTeamMemberStatusRequest = {
  status: Extract<TeamMemberStatus, "active" | "deactivated">;
};

export function mapApiTeamMemberToTeamMember(member: ApiTeamMember): TeamMember {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    department: member.department,
    projects: member.projects,
    joinedDate: member.joinedDate,
    role: member.role,
    status: member.status,
    lastActive: member.lastActive,
  };
}

export function mapTeamInvitePayloadToRequest(payload: TeamInvitePayload): InviteTeamMemberRequest {
  return {
    email: payload.email,
    name: payload.name,
    role: payload.role,
    department: payload.department,
    message: payload.message,
    sendWelcomeEmail: payload.sendWelcomeEmail,
  };
}
