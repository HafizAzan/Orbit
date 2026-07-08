import { CheckCircleOutlined, ProjectOutlined, TeamOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";

export type DashboardPeriodFilter = "today" | "this_week" | "this_month" | "last_6_months" | "this_year";

export const DASHBOARD_PERIOD_FILTER_OPTIONS: { value: DashboardPeriodFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_6_months", label: "Last 6 Months" },
  { value: "this_year", label: "This Year" },
];

export const DEFAULT_DASHBOARD_PERIOD_FILTER: DashboardPeriodFilter = "this_month";

export const VELOCITY_CHART_SUBTITLES: Record<DashboardPeriodFilter, string> = {
  today: "How many tasks were completed today",
  this_week: "Tasks completed on each day of this week",
  this_month: "Tasks completed on each day of this month",
  last_6_months: "Tasks completed in each month",
  this_year: "Tasks completed in each month this year",
};

export type WorkspaceMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "stable";
  icon: "projects" | "tasks" | "team" | "completed";
  iconBg: string;
};

export type VelocityPoint = {
  date: string;
  completed: number;
};

export type TaskStatusSlice = {
  id: string;
  label: string;
  count: number;
  color: string;
};

export type ActiveProject = {
  id: string;
  name: string;
  updatedAt: string;
  progress: number;
  iconBg: string;
};

export type CriticalDeadline = {
  id: string;
  title: string;
  subtitle: string;
  month: string;
  day: string;
  priority?: "high";
  assignees?: number;
};

export type WorkspaceActivityItem = {
  id: string;
  userName: string;
  action: string;
  target: string;
  timeAgo: string;
  comment?: string;
  avatarColor: string;
};

export const WORKSPACE_METRIC_ICONS: Record<WorkspaceMetric["icon"], ComponentType<{ className?: string }>> = {
  projects: ProjectOutlined,
  tasks: UnorderedListOutlined,
  team: TeamOutlined,
  completed: CheckCircleOutlined,
};
