import {
  AlertOutlined,
  ApiOutlined,
  BankOutlined,
  CreditCardOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type ActivityCategory = "organization" | "subscription" | "user" | "billing" | "system";

export type ActivitySeverity = "info" | "success" | "warning" | "critical";

export type ActivityReviewStatus = "none" | "flagged" | "resolved";

export type ActivityFlagReason = "security" | "billing" | "compliance" | "system" | "other";

export type ActivityTabKey = "all" | ActivityCategory;

export type ActivityRecord = {
  id: string;
  title: string;
  description: string;
  organization: string;
  actor: string;
  category: ActivityCategory;
  severity: ActivitySeverity;
  timestamp: string;
  reviewStatus: ActivityReviewStatus;
  flagReason?: ActivityFlagReason;
  flagNote?: string;
  flaggedAt?: string;
  resolvedAt?: string;
};

export type ActivityStat = {
  id: string;
  label: string;
  value: string;
  meta: string;
  metaVariant: "muted" | "primary" | "danger";
  icon: "events" | "critical" | "users" | "system";
  variant?: "default" | "danger";
};

export const ACTIVITY_STATS: ActivityStat[] = [
  {
    id: "events",
    label: "Events Today",
    value: "1,284",
    meta: "+18% vs yesterday",
    metaVariant: "primary",
    icon: "events",
  },
  {
    id: "critical",
    label: "Critical Alerts",
    value: "3",
    meta: "Needs review",
    metaVariant: "danger",
    icon: "critical",
    variant: "danger",
  },
  {
    id: "users",
    label: "User Actions",
    value: "842",
    meta: "66% of total",
    metaVariant: "muted",
    icon: "users",
  },
  {
    id: "system",
    label: "System Events",
    value: "156",
    meta: "Last sync 1m ago",
    metaVariant: "muted",
    icon: "system",
  },
];

export const ACTIVITY_TABS: { key: ActivityTabKey; label: string }[] = [
  { key: "all", label: "All Events" },
  { key: "organization", label: "Organizations" },
  { key: "subscription", label: "Subscriptions" },
  { key: "user", label: "Users" },
  { key: "billing", label: "Billing" },
];

export const ACTIVITIES_PAGE_SIZE = 25;

export const ACTIVITY_FLAG_REASON_OPTIONS: { value: ActivityFlagReason; label: string }[] = [
  { value: "security", label: "Security concern" },
  { value: "billing", label: "Billing issue" },
  { value: "compliance", label: "Compliance review" },
  { value: "system", label: "System anomaly" },
  { value: "other", label: "Other" },
];

export const ACTIVITIES_DATA: ActivityRecord[] = [];

export const ACTIVITY_STAT_ICONS: Record<ActivityStat["icon"], ComponentType<{ className?: string }>> = {
  events: FieldTimeOutlined,
  critical: AlertOutlined,
  users: UserSwitchOutlined,
  system: ApiOutlined,
};

export const ACTIVITY_META_STYLES: Record<ActivityStat["metaVariant"], string> = {
  muted: "bg-slate-100 text-muted",
  primary: "bg-indigo-50 text-primary",
  danger: "bg-red-50 text-red-600",
};

export const ACTIVITY_CATEGORY_STYLES: Record<ActivityCategory, string> = {
  organization: "border-violet-200 bg-violet-50 text-violet-700",
  subscription: "border-sky-200 bg-sky-50 text-sky-700",
  user: "border-indigo-200 bg-indigo-50 text-indigo-700",
  billing: "border-emerald-200 bg-emerald-50 text-emerald-700",
  system: "border-slate-200 bg-slate-100 text-slate-700",
};

export const ACTIVITY_SEVERITY_FILTER_OPTIONS: { value: ActivitySeverity; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
];

export const ACTIVITY_CATEGORY_FILTER_OPTIONS: { value: ActivityCategory; label: string }[] = [
  { value: "organization", label: "Organizations" },
  { value: "subscription", label: "Subscriptions" },
  { value: "user", label: "Users" },
  { value: "billing", label: "Billing" },
  { value: "system", label: "System" },
];

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  organization: "Organization",
  subscription: "Subscription",
  user: "User",
  billing: "Billing",
  system: "System",
};

export const ACTIVITY_CATEGORY_ICONS: Record<ActivityCategory, ComponentType<{ className?: string }>> = {
  organization: BankOutlined,
  subscription: CreditCardOutlined,
  user: TeamOutlined,
  billing: CreditCardOutlined,
  system: ApiOutlined,
};

export const ACTIVITY_SEVERITY_STYLES: Record<ActivitySeverity, { dot: string; label: string }> = {
  info: { dot: "bg-sky-400", label: "Info" },
  success: { dot: "bg-emerald-500", label: "Success" },
  warning: { dot: "bg-amber-500", label: "Warning" },
  critical: { dot: "bg-red-500", label: "Critical" },
};
