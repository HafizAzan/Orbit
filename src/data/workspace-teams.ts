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

export function findTeamMemberByEmail(email: string, members: TeamMember[] = TEAM_MEMBERS) {
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

export function createInvitedTeamMember(payload: TeamInvitePayload): TeamMember {
  const displayName = payload.name?.trim() || payload.email.split("@")[0].replace(/[._-]/g, " ");
  const formattedName = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    id: `invite-${Date.now()}`,
    name: formattedName,
    email: payload.email.trim().toLowerCase(),
    department: payload.department,
    projects: 0,
    joinedDate: "Pending",
    role: payload.role,
    status: "invited",
    lastActive: "Invite sent",
    avatarColor: "bg-sky-100 text-sky-700",
  };
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

export const TEAM_SUMMARY_STATS = {
  totalSeats: { used: 24, total: 50 },
  pendingInvites: 3,
  activeToday: 18,
  activeTodayTrend: "+12% from last week",
};

export const TEAM_SUMMARY_ICONS: Record<"seats" | "invites" | "active", ComponentType<{ className?: string }>> = {
  seats: TeamOutlined,
  invites: MailOutlined,
  active: ThunderboltOutlined,
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@flowsync.io",
    department: "product",
    projects: 6,
    joinedDate: "Jan 8, 2022",
    role: "owner",
    status: "active",
    lastActive: "Just now",
    avatarColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.chen@flowsync.io",
    department: "engineering",
    projects: 5,
    joinedDate: "Mar 14, 2022",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    avatarColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@flowsync.io",
    department: "design",
    projects: 4,
    joinedDate: "Jun 2, 2023",
    role: "manager",
    status: "invited",
    lastActive: "Oct 24, 2023",
    avatarColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@flowsync.io",
    department: "engineering",
    projects: 3,
    joinedDate: "Aug 19, 2022",
    role: "member",
    status: "active",
    lastActive: "Yesterday",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "5",
    name: "Priya Sharma",
    email: "priya.sharma@flowsync.io",
    department: "marketing",
    projects: 2,
    joinedDate: "Feb 11, 2021",
    role: "member",
    status: "deactivated",
    lastActive: "Sep 12, 2023",
    avatarColor: "bg-rose-100 text-rose-700",
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@flowsync.io",
    department: "engineering",
    projects: 4,
    joinedDate: "Nov 5, 2022",
    role: "admin",
    status: "active",
    lastActive: "30 minutes ago",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "7",
    name: "Aisha Patel",
    email: "aisha.patel@flowsync.io",
    department: "product",
    projects: 5,
    joinedDate: "Apr 22, 2023",
    role: "manager",
    status: "active",
    lastActive: "4 hours ago",
    avatarColor: "bg-teal-100 text-teal-700",
  },
  {
    id: "8",
    name: "Oliver Brown",
    email: "oliver.brown@flowsync.io",
    department: "design",
    projects: 2,
    joinedDate: "Oct 30, 2023",
    role: "member",
    status: "invited",
    lastActive: "Nov 2, 2023",
    avatarColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "9",
    name: "Sophie Laurent",
    email: "sophie.laurent@flowsync.io",
    department: "marketing",
    projects: 3,
    joinedDate: "Jul 7, 2023",
    role: "member",
    status: "active",
    lastActive: "1 hour ago",
    avatarColor: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    id: "10",
    name: "Ryan O'Connor",
    email: "ryan.oconnor@flowsync.io",
    department: "operations",
    projects: 4,
    joinedDate: "May 18, 2022",
    role: "manager",
    status: "active",
    lastActive: "3 hours ago",
    avatarColor: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "11",
    name: "Mia Thompson",
    email: "mia.thompson@flowsync.io",
    department: "engineering",
    projects: 2,
    joinedDate: "Sep 1, 2023",
    role: "member",
    status: "active",
    lastActive: "Today",
    avatarColor: "bg-lime-100 text-lime-700",
  },
  {
    id: "12",
    name: "Lucas Garcia",
    email: "lucas.garcia@flowsync.io",
    department: "engineering",
    projects: 1,
    joinedDate: "Dec 3, 2021",
    role: "member",
    status: "deactivated",
    lastActive: "Aug 5, 2023",
    avatarColor: "bg-stone-100 text-stone-700",
  },
  {
    id: "13",
    name: "Nina Volkov",
    email: "nina.volkov@flowsync.io",
    department: "product",
    projects: 6,
    joinedDate: "Jan 27, 2023",
    role: "admin",
    status: "active",
    lastActive: "5 hours ago",
    avatarColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "14",
    name: "Ethan Moore",
    email: "ethan.moore@flowsync.io",
    department: "design",
    projects: 2,
    joinedDate: "Oct 10, 2023",
    role: "member",
    status: "invited",
    lastActive: "Oct 18, 2023",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "15",
    name: "Hannah Lee",
    email: "hannah.lee@flowsync.io",
    department: "marketing",
    projects: 4,
    joinedDate: "Mar 9, 2022",
    role: "manager",
    status: "active",
    lastActive: "6 hours ago",
    avatarColor: "bg-pink-100 text-pink-700",
  },
  {
    id: "16",
    name: "Daniel Foster",
    email: "daniel.foster@flowsync.io",
    department: "engineering",
    projects: 3,
    joinedDate: "Feb 16, 2023",
    role: "member",
    status: "active",
    lastActive: "Yesterday",
    avatarColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "17",
    name: "Zara Ahmed",
    email: "zara.ahmed@flowsync.io",
    department: "operations",
    projects: 2,
    joinedDate: "Aug 4, 2023",
    role: "member",
    status: "active",
    lastActive: "2 days ago",
    avatarColor: "bg-red-100 text-red-700",
  },
  {
    id: "18",
    name: "Chris Nguyen",
    email: "chris.nguyen@flowsync.io",
    department: "engineering",
    projects: 5,
    joinedDate: "Jun 21, 2022",
    role: "member",
    status: "active",
    lastActive: "Today",
    avatarColor: "bg-green-100 text-green-700",
  },
  {
    id: "19",
    name: "Emma Walsh",
    email: "emma.walsh@flowsync.io",
    department: "product",
    projects: 4,
    joinedDate: "Apr 3, 2023",
    role: "manager",
    status: "active",
    lastActive: "1 day ago",
    avatarColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "20",
    name: "Tom Becker",
    email: "tom.becker@flowsync.io",
    department: "operations",
    projects: 1,
    joinedDate: "Nov 18, 2021",
    role: "member",
    status: "deactivated",
    lastActive: "Jul 20, 2023",
    avatarColor: "bg-slate-100 text-slate-700",
  },
  {
    id: "21",
    name: "Isabella Costa",
    email: "isabella.costa@flowsync.io",
    department: "design",
    projects: 3,
    joinedDate: "Jul 29, 2023",
    role: "member",
    status: "active",
    lastActive: "8 hours ago",
    avatarColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "22",
    name: "Noah Martinez",
    email: "noah.martinez@flowsync.io",
    department: "engineering",
    projects: 5,
    joinedDate: "Oct 6, 2022",
    role: "admin",
    status: "active",
    lastActive: "45 minutes ago",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "23",
    name: "Grace Taylor",
    email: "grace.taylor@flowsync.io",
    department: "marketing",
    projects: 2,
    joinedDate: "Nov 1, 2023",
    role: "member",
    status: "invited",
    lastActive: "Nov 8, 2023",
    avatarColor: "bg-teal-100 text-teal-700",
  },
  {
    id: "24",
    name: "Alex Johnson",
    email: "alex.johnson@flowsync.io",
    department: "engineering",
    projects: 3,
    joinedDate: "May 12, 2023",
    role: "member",
    status: "active",
    lastActive: "3 days ago",
    avatarColor: "bg-sky-100 text-sky-700",
  },
];
