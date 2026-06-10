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

export const ACTIVITY_FILTER_OPTIONS = [
  { key: "severity", label: "Severity" },
  { key: "organization", label: "Organization" },
  { key: "actor", label: "Actor" },
  { key: "date-range", label: "Date Range" },
] as const;

export const ACTIVITIES_PAGE_SIZE = 25;

export const ACTIVITIES_DATA: ActivityRecord[] = [
  {
    id: "1",
    title: "New organization registered",
    description: "Global Corp joined with Enterprise plan · 120 seats",
    organization: "Global Corp",
    actor: "Sarah Jenkins",
    category: "organization",
    severity: "success",
    timestamp: "2m ago",
  },
  {
    id: "2",
    title: "Subscription upgraded",
    description: "Acme Inc. moved from Pro to Enterprise plan",
    organization: "Acme Corp",
    actor: "Michael Chen",
    category: "subscription",
    severity: "success",
    timestamp: "15m ago",
  },
  {
    id: "3",
    title: "Seat expansion completed",
    description: "Tech Solutions added 50 seats on Pro plan",
    organization: "Tech Solutions",
    actor: "Emily Davis",
    category: "subscription",
    severity: "info",
    timestamp: "1h ago",
  },
  {
    id: "4",
    title: "Admin role assigned",
    description: "Michael Chen registered as platform administrator",
    organization: "Nova Labs",
    actor: "System",
    category: "user",
    severity: "info",
    timestamp: "3h ago",
  },
  {
    id: "5",
    title: "Payment failed",
    description: "Invoice #INV-2041 could not be processed for Pied Piper",
    organization: "Pied Piper",
    actor: "Billing Engine",
    category: "billing",
    severity: "critical",
    timestamp: "4h ago",
  },
  {
    id: "6",
    title: "Trial started",
    description: "Beta Works activated a 14-day Pro trial",
    organization: "Beta Works",
    actor: "Lisa Park",
    category: "subscription",
    severity: "success",
    timestamp: "5h ago",
  },
  {
    id: "7",
    title: "User suspended",
    description: "Richard Hendricks account suspended due to policy violation",
    organization: "Pied Piper",
    actor: "Alex Rivera",
    category: "user",
    severity: "warning",
    timestamp: "6h ago",
  },
  {
    id: "8",
    title: "API rate limit exceeded",
    description: "Oscorp exceeded 10k requests/min threshold on production API",
    organization: "Oscorp",
    actor: "API Gateway",
    category: "system",
    severity: "critical",
    timestamp: "7h ago",
  },
  {
    id: "9",
    title: "Organization profile updated",
    description: "Wayne Enterprises updated billing address and tax ID",
    organization: "Wayne Enterprises",
    actor: "Bruce Wayne",
    category: "organization",
    severity: "info",
    timestamp: "8h ago",
  },
  {
    id: "10",
    title: "Subscription cancelled",
    description: "Initech cancelled Business plan · effective end of cycle",
    organization: "Initech",
    actor: "James Wilson",
    category: "subscription",
    severity: "warning",
    timestamp: "10h ago",
  },
  {
    id: "11",
    title: "Invoice paid",
    description: "Payment of $12,400 received for Acme Corp Enterprise plan",
    organization: "Acme Corp",
    actor: "Stripe",
    category: "billing",
    severity: "success",
    timestamp: "12h ago",
  },
  {
    id: "12",
    title: "Bulk user import",
    description: "142 users imported via CSV for Hooli workspace",
    organization: "Hooli",
    actor: "Gavin Belson",
    category: "user",
    severity: "success",
    timestamp: "14h ago",
  },
  {
    id: "13",
    title: "Webhook delivery failed",
    description: "3 consecutive failures for Stark Industries event endpoint",
    organization: "Stark Industries",
    actor: "Webhook Service",
    category: "system",
    severity: "critical",
    timestamp: "16h ago",
  },
  {
    id: "14",
    title: "Organization merged",
    description: "Vertex AI assets merged into Cloud Nine organization",
    organization: "Cloud Nine",
    actor: "Platform Admin",
    category: "organization",
    severity: "info",
    timestamp: "18h ago",
  },
  {
    id: "15",
    title: "Refund issued",
    description: "$2,400 refund processed for duplicate charge on Umbrella Co",
    organization: "Umbrella Co",
    actor: "Finance Bot",
    category: "billing",
    severity: "warning",
    timestamp: "1d ago",
  },
  {
    id: "16",
    title: "Password reset requested",
    description: "Tony Stark initiated a secure password reset flow",
    organization: "Stark Industries",
    actor: "Tony Stark",
    category: "user",
    severity: "info",
    timestamp: "1d ago",
  },
  {
    id: "17",
    title: "Database maintenance completed",
    description: "Scheduled index optimization finished across US East cluster",
    organization: "FlowSync",
    actor: "DevOps",
    category: "system",
    severity: "success",
    timestamp: "1d ago",
  },
  {
    id: "18",
    title: "Plan downgraded",
    description: "Globex Inc downgraded from Enterprise to Pro plan",
    organization: "Globex Inc",
    actor: "Lisa Park",
    category: "subscription",
    severity: "warning",
    timestamp: "2d ago",
  },
];

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
