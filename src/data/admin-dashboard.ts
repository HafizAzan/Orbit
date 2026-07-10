import {
  BankOutlined,
  CrownOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  icon: "organizations" | "users" | "subscriptions" | "revenue";
  iconBg: string;
};

export type RevenueDataPoint = {
  month: string;
  revenue: number;
};

export type GrowthStat = {
  id: string;
  label: string;
  value: string;
  progress: number;
  helperText: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  icon: "organization" | "upgrade" | "seats" | "admin";
  iconBg: string;
  iconColor: string;
};

export type SystemRegion = {
  id: string;
  name: string;
  status: "operational" | "degraded";
};

export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: "organizations",
    label: "Total Organizations",
    value: "1,284",
    trend: "+12.5%",
    icon: "organizations",
    iconBg: "bg-indigo-50",
  },
  {
    id: "users",
    label: "Active Users",
    value: "42,591",
    trend: "+8.2%",
    icon: "users",
    iconBg: "bg-sky-50",
  },
  {
    id: "subscriptions",
    label: "Active Subscriptions",
    value: "8,102",
    trend: "+5.4%",
    icon: "subscriptions",
    iconBg: "bg-violet-50",
  },
  {
    id: "revenue",
    label: "Monthly Revenue",
    value: "$425,000",
    trend: "+18.7%",
    icon: "revenue",
    iconBg: "bg-emerald-50",
  },
];

export const REVENUE_CHART_DATA: RevenueDataPoint[] = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 195000 },
  { month: "Apr", revenue: 240000 },
  { month: "May", revenue: 265000 },
  { month: "Jun", revenue: 280000 },
  { month: "Jul", revenue: 310000 },
  { month: "Aug", revenue: 295000 },
  { month: "Sep", revenue: 340000 },
  { month: "Oct", revenue: 360000 },
  { month: "Nov", revenue: 390000 },
  { month: "Dec", revenue: 425000 },
];

export const GROWTH_STATS: GrowthStat[] = [
  {
    id: "new-orgs",
    label: "New Organizations",
    value: "142",
    progress: 72,
    helperText: "+24% from last month",
  },
  {
    id: "user-growth",
    label: "User Growth",
    value: "4.2k",
    progress: 58,
    helperText: "+1,102 new users this week",
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    title: "Global Corp joined as a new organization",
    description: "Enterprise plan · 120 seats",
    timeAgo: "2m ago",
    icon: "organization",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "2",
    title: "Sarah Jenkins upgraded to Enterprise plan",
    description: "Acme Inc. · Billing updated",
    timeAgo: "15m ago",
    icon: "upgrade",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "3",
    title: "Tech Solutions added 50 new seats",
    description: "Pro plan · Seat expansion",
    timeAgo: "1h ago",
    icon: "seats",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "4",
    title: "Michael Chen registered as an administrator",
    description: "Nova Labs · Admin role assigned",
    timeAgo: "3h ago",
    icon: "admin",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export const SYSTEM_REGIONS: SystemRegion[] = [
  { id: "us-east", name: "US East", status: "operational" },
  { id: "eu-west", name: "EU West", status: "operational" },
  { id: "asia-south", name: "Asia South", status: "operational" },
];

export type TopOrgItem = {
  id: string;
  name: string;
  plan: string;
  revenue: number;
  initial: string;
  color: string;
};

export type ActiveOrgItem = {
  id: string;
  name: string;
  sessions: number;
  activity: number;
  avatarSeed: string;
};

export type RecentSignupItem = {
  id: string;
  name: string;
  timeAgo: string;
  planBadge: string;
  badgeClass: string;
};

export const CHURN_RATE = {
  value: 2.4,
  label: "Sustainable",
  helperText: "Churn has decreased by 0.3% this month due to improved onboarding.",
};

export const GROWTH_FORECAST = {
  target: "$6.2M",
  helperText: "On track to hit goal by Q4.",
};

export const TOP_ORGS: TopOrgItem[] = [];

export const MOST_ACTIVE_ORGS: ActiveOrgItem[] = [];

export const RECENT_SIGNUPS: RecentSignupItem[] = [];

export const DASHBOARD_METRIC_ICONS: Record<
  DashboardMetric["icon"],
  ComponentType<{ className?: string }>
> = {
  organizations: BankOutlined,
  users: UserOutlined,
  subscriptions: TeamOutlined,
  revenue: DollarOutlined,
};

export const DASHBOARD_ACTIVITY_ICONS: Record<
  ActivityItem["icon"],
  ComponentType<{ className?: string }>
> = {
  organization: UserAddOutlined,
  upgrade: CrownOutlined,
  seats: TeamOutlined,
  admin: SafetyCertificateOutlined,
};
