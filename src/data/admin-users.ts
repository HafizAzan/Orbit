import {
  RiseOutlined,
  StopOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type UserRole = "Admin" | "Manager" | "Member";

export type UserStatus = "active" | "pending" | "suspended";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  lastActive: string;
  status: UserStatus;
};

export type UserStat = {
  id: string;
  label: string;
  value: string;
  meta: string;
  metaVariant: "muted" | "primary" | "danger";
  icon: "total" | "active" | "new" | "suspended";
  variant?: "default" | "danger";
};

export const USER_STATS: UserStat[] = [
  {
    id: "total",
    label: "Total Users",
    value: "42,591",
    meta: "Updated 1m ago",
    metaVariant: "muted",
    icon: "total",
  },
  {
    id: "active",
    label: "Active Users",
    value: "38,102",
    meta: "89% of total",
    metaVariant: "muted",
    icon: "active",
  },
  {
    id: "new",
    label: "New Users This Month",
    value: "+2,410",
    meta: "+12.4%",
    metaVariant: "primary",
    icon: "new",
  },
  {
    id: "suspended",
    label: "Suspended Users",
    value: "142",
    meta: "-2% decrease",
    metaVariant: "danger",
    icon: "suspended",
    variant: "danger",
  },
];

export const USERS_PAGE_SIZE = 25;

export const USERS_DATA: UserRecord[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@acme.com",
    organization: "Acme Corp",
    role: "Admin",
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@stark.com",
    organization: "Stark Industries",
    role: "Manager",
    lastActive: "Just now",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@umbrella.co",
    organization: "Umbrella Co",
    role: "Member",
    lastActive: "5 hours ago",
    status: "active",
  },
  {
    id: "4",
    name: "John Doe",
    email: "john@acme.com",
    organization: "Acme Corp",
    role: "Member",
    lastActive: "1 day ago",
    status: "pending",
  },
  {
    id: "5",
    name: "Tony Stark",
    email: "tony@stark.com",
    organization: "Stark Industries",
    role: "Admin",
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    id: "6",
    name: "Bruce Wayne",
    email: "bruce@wayne.com",
    organization: "Wayne Enterprises",
    role: "Admin",
    lastActive: "Yesterday",
    status: "active",
  },
  {
    id: "7",
    name: "Richard Hendricks",
    email: "richard@piedpiper.com",
    organization: "Pied Piper",
    role: "Manager",
    lastActive: "4 days ago",
    status: "suspended",
  },
  {
    id: "8",
    name: "Gavin Belson",
    email: "gavin@hooli.com",
    organization: "Hooli",
    role: "Admin",
    lastActive: "6 hours ago",
    status: "active",
  },
  {
    id: "9",
    name: "Norman Osborn",
    email: "norman@oscorp.com",
    organization: "Oscorp",
    role: "Member",
    lastActive: "2 weeks ago",
    status: "suspended",
  },
  {
    id: "10",
    name: "Alex Rivera",
    email: "alex.rivera@flowsync.io",
    organization: "FlowSync",
    role: "Admin",
    lastActive: "Just now",
    status: "active",
  },
  {
    id: "11",
    name: "Lisa Park",
    email: "lisa@globex.io",
    organization: "Globex Inc",
    role: "Manager",
    lastActive: "30 minutes ago",
    status: "active",
  },
  {
    id: "12",
    name: "James Wilson",
    email: "james@initech.net",
    organization: "Initech",
    role: "Member",
    lastActive: "3 days ago",
    status: "pending",
  },
];

export const USER_STATUS_FILTER_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

export const USER_ROLE_FILTER_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Member", label: "Member" },
];

export const USER_ORGANIZATION_FILTER_OPTIONS = Array.from(new Set(USERS_DATA.map((user) => user.organization)))
  .sort()
  .map((name) => ({ value: name, label: name }));

export const USER_STAT_ICONS: Record<UserStat["icon"], ComponentType<{ className?: string }>> = {
  total: TeamOutlined,
  active: ThunderboltOutlined,
  new: RiseOutlined,
  suspended: StopOutlined,
};

export const USER_META_STYLES: Record<UserStat["metaVariant"], string> = {
  muted: "bg-slate-100 text-muted",
  primary: "bg-indigo-50 text-primary",
  danger: "bg-red-50 text-red-600",
};

export const USER_ROLE_STYLES: Record<UserRole, string> = {
  Admin: "border-violet-200 bg-violet-50 text-violet-700",
  Manager: "border-sky-200 bg-sky-50 text-sky-700",
  Member: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

export const USER_STATUS_STYLES: Record<UserStatus, { dot: string; label: string }> = {
  active: { dot: "bg-emerald-500", label: "Active" },
  pending: { dot: "bg-slate-400", label: "Pending" },
  suspended: { dot: "bg-red-500", label: "Suspended" },
};
