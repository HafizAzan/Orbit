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

export const WORKSPACE_DASHBOARD_METRICS: WorkspaceMetric[] = [
  {
    id: "total-projects",
    label: "Total Projects",
    value: "12",
    trend: "+2.4%",
    trendType: "up",
    icon: "projects",
    iconBg: "bg-indigo-50",
  },
  {
    id: "active-tasks",
    label: "Active Tasks",
    value: "48",
    trend: "+12%",
    trendType: "up",
    icon: "tasks",
    iconBg: "bg-sky-50",
  },
  {
    id: "team-members",
    label: "Total Members",
    value: "24",
    trend: "In workspace",
    trendType: "stable",
    icon: "team",
    iconBg: "bg-violet-50",
  },
  {
    id: "completed-tasks",
    label: "Completed Tasks",
    value: "156",
    trend: "+18",
    trendType: "up",
    icon: "completed",
    iconBg: "bg-emerald-50",
  },
];

export const TEAM_VELOCITY_DATA: VelocityPoint[] = [
  { date: "Aug 01", completed: 12 },
  { date: "Aug 05", completed: 18 },
  { date: "Aug 09", completed: 15 },
  { date: "Aug 14", completed: 24 },
  { date: "Aug 18", completed: 21 },
  { date: "Aug 22", completed: 28 },
  { date: "Aug 26", completed: 32 },
  { date: "Today", completed: 36 },
];

export const TASK_STATUS_DATA: TaskStatusSlice[] = [
  { id: "done", label: "Done", count: 24, color: "#312e81" },
  { id: "review", label: "Review", count: 12, color: "#6366f1" },
  { id: "progress", label: "Progress", count: 8, color: "#818cf8" },
  { id: "todo", label: "To Do", count: 4, color: "#cbd5e1" },
];

export const ACTIVE_PROJECTS: ActiveProject[] = [
  {
    id: "1",
    name: "Mars Landing Mobile App",
    updatedAt: "2 hours ago",
    progress: 78,
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "2",
    name: "Internal CRM Overhaul",
    updatedAt: "Yesterday",
    progress: 42,
    iconBg: "bg-sky-50 text-sky-600",
  },
  {
    id: "3",
    name: "Q4 Marketing Campaign",
    updatedAt: "3 days ago",
    progress: 94,
    iconBg: "bg-violet-50 text-violet-600",
  },
];

export const CRITICAL_DEADLINES: CriticalDeadline[] = [
  {
    id: "1",
    month: "Sep",
    day: "12",
    title: "Final Design Review",
    subtitle: "Mars Landing App",
    priority: "high",
  },
  {
    id: "2",
    month: "Sep",
    day: "15",
    title: "API Integration Deadline",
    subtitle: "Internal CRM",
    assignees: 3,
  },
  {
    id: "3",
    month: "Sep",
    day: "20",
    title: "Stakeholder Presentation",
    subtitle: "Q4 Marketing",
  },
];

export const WORKSPACE_ACTIVITY: WorkspaceActivityItem[] = [
  {
    id: "1",
    userName: "Sarah Jenkins",
    action: "moved",
    target: "API Auth",
    timeAgo: "12m ago",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "2",
    userName: "Marcus Thorne",
    action: "commented on",
    target: "Design System",
    timeAgo: "45m ago",
    comment: "Can we use the new primary color palette for the buttons?",
    avatarColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "3",
    userName: "Elena Rodriguez",
    action: "uploaded",
    target: "3 files",
    timeAgo: "2h ago",
    avatarColor: "bg-violet-100 text-violet-700",
  },
];

export const WORKSPACE_METRIC_ICONS: Record<WorkspaceMetric["icon"], ComponentType<{ className?: string }>> = {
  projects: ProjectOutlined,
  tasks: UnorderedListOutlined,
  team: TeamOutlined,
  completed: CheckCircleOutlined,
};
