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
  organizationId?: string | null;
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

export const USERS_DATA: UserRecord[] = [];

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

export const USER_ORGANIZATION_FILTER_OPTIONS: { value: string; label: string }[] = [];

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
