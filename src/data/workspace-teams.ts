import { MailOutlined, TeamOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type TeamMemberRole = "owner" | "admin" | "manager" | "member";

export type TeamMemberStatus = "active" | "invited" | "deactivated";

export type TeamMemberDepartment = "engineering" | "design" | "product" | "marketing" | "operations";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  department: TeamMemberDepartment;
  projects: number;
  joinedDate: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  lastActive: string;
  avatarColor?: string;
};

export const TEAM_DEPARTMENT_LABELS: Record<TeamMemberDepartment, string> = {
  engineering: "Engineering",
  design: "Design",
  product: "Product",
  marketing: "Marketing",
  operations: "Operations",
};

export type TeamTableFilters = {
  role: TeamMemberRole | "all";
  status: TeamMemberStatus | "all";
};

export const DEFAULT_TEAM_TABLE_FILTERS: TeamTableFilters = {
  role: "all",
  status: "all",
};

export const TEAM_MEMBERS_PAGE_SIZE = 5;

export const TEAM_ROLE_FILTER_OPTIONS: { value: TeamTableFilters["role"]; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
];

export const TEAM_STATUS_FILTER_OPTIONS: { value: TeamTableFilters["status"]; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "deactivated", label: "Deactivated" },
];

export const TEAM_ROLE_LABELS: Record<TeamMemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  member: "Member",
};

export type TeamInviteRole = Exclude<TeamMemberRole, "owner">;

export const TEAM_INVITE_ROLE_OPTIONS: { value: TeamInviteRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
];

export const TEAM_DEPARTMENT_OPTIONS: { value: TeamMemberDepartment; label: string }[] = (
  Object.entries(TEAM_DEPARTMENT_LABELS) as [TeamMemberDepartment, string][]
).map(([value, label]) => ({ value, label }));

export type TeamRolePermissionInfo = {
  title: string;
  description: string;
  bullets: string[];
  accent: string;
};

export const TEAM_ROLE_PERMISSIONS: Record<TeamInviteRole, TeamRolePermissionInfo> = {
  admin: {
    title: "Admin",
    description: "Full workspace control except ownership transfer.",
    bullets: [
      "Invite and manage members",
      "Create and delete projects",
      "Manage all task boards",
      "Update billing and settings",
    ],
    accent: "border-violet-200 bg-violet-50 text-violet-700",
  },
  manager: {
    title: "Manager",
    description: "Ideal for team leads who coordinate delivery.",
    bullets: [
      "Create projects and assign execution squads",
      "Assign and manage tasks for your team",
      "Remove members from projects you lead",
      "View reports for your delivery scope",
    ],
    accent: "border-sky-200 bg-sky-50 text-sky-700",
  },
  member: {
    title: "Member",
    description: "Standard access for contributors on assigned work.",
    bullets: [
      "Work on assigned tasks",
      "Collaborate on projects",
      "Comment and share updates",
      "Update personal profile",
    ],
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export type TeamInvitePayload = {
  email: string;
  name?: string;
  role: TeamInviteRole;
  department: TeamMemberDepartment;
  message?: string;
  sendWelcomeEmail: boolean;
};

export function findTeamMemberByEmail(email: string, members: TeamMember[]) {
  const normalized = email.trim().toLowerCase();
  return members.find((member) => member.email.trim().toLowerCase() === normalized) ?? null;
}

export function getDuplicateInviteMessage(member: TeamMember) {
  if (member.status === "invited") {
    return "This email already has a pending invitation.";
  }

  if (member.status === "active") {
    return "This person is already an active team member.";
  }

  return "This member is deactivated. Reactivate them or permanently delete them before inviting this email again.";
}

export const TEAM_ROLE_STYLES: Record<TeamMemberRole, string> = {
  owner: "font-semibold text-primary",
  admin: "text-sm font-medium text-foreground",
  manager: "text-sm font-medium text-foreground",
  member: "text-sm font-medium text-foreground",
};

export const TEAM_STATUS_STYLES: Record<TeamMemberStatus, { dot: string; pill: string; label: string }> = {
  active: {
    dot: "bg-emerald-500",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: "Active",
  },
  invited: {
    dot: "bg-sky-500",
    pill: "border-sky-200 bg-sky-50 text-sky-700",
    label: "Invited",
  },
  deactivated: {
    dot: "bg-slate-400",
    pill: "border-slate-200 bg-slate-100 text-slate-600",
    label: "Deactivated",
  },
};

export const TEAM_SUMMARY_ICONS: Record<"seats" | "invites" | "active", ComponentType<{ className?: string }>> = {
  seats: TeamOutlined,
  invites: MailOutlined,
  active: ThunderboltOutlined,
};
