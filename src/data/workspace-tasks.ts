import { WORKSPACE_PROJECTS } from "./workspace-projects";

export type WorkspaceTaskStatus = "todo" | "in_progress" | "review" | "done";
export type WorkspaceTaskPriority = "critical" | "high" | "medium" | "low";

export type WorkspaceTaskAssignee = {
  id: string;
  name: string;
  initials: string;
};

export type WorkspaceTask = {
  id: string;
  taskCode: string;
  title: string;
  project: string;
  projectId: string;
  assignee: WorkspaceTaskAssignee;
  priority: WorkspaceTaskPriority;
  status: WorkspaceTaskStatus;
  dueDate: string;
};

export const WORKSPACE_TASKS_PAGE_SIZE = 10;

export const TASK_STATUS_CONFIG: Record<
  WorkspaceTaskStatus,
  { label: string; dot: string; badgeClass: string }
> = {
  todo: {
    label: "TODO",
    dot: "bg-slate-400",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
  },
  in_progress: {
    label: "IN PROGRESS",
    dot: "bg-primary",
    badgeClass: "border-primary/20 bg-feature-sync text-primary",
  },
  review: {
    label: "REVIEW",
    dot: "bg-amber-500",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  done: {
    label: "DONE",
    dot: "bg-emerald-500",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export const TASK_PRIORITY_CONFIG: Record<
  WorkspaceTaskPriority,
  { label: string; badgeClass: string }
> = {
  critical: {
    label: "CRITICAL",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
  },
  high: {
    label: "HIGH",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
  },
  medium: {
    label: "MEDIUM",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
  },
  low: {
    label: "LOW",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
  },
};

export const TASK_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
] as const;

export const TASK_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All priorities" },
  ...Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
] as const;

export const TASK_ASSIGNEE_FILTER_OPTIONS = [
  { value: "all", label: "All assignees" },
  { value: "sarah-jenkins", label: "Sarah Jenkins" },
  { value: "michael-chen", label: "Michael Chen" },
  { value: "elena-rodriguez", label: "Elena Rodriguez" },
  { value: "david-miller", label: "David Miller" },
  { value: "chloe-sterling", label: "Chloe Sterling" },
] as const;

export const TASK_DUE_DATE_FILTER_OPTIONS = [
  { value: "all", label: "Any due date" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

export const TASK_PROJECT_FILTER_OPTIONS = [
  { value: "all", label: "All projects" },
  ...WORKSPACE_PROJECTS.map((project) => ({
    value: project.id,
    label: project.id === "1" ? "Project Omega" : project.title,
  })),
] as const;

export type TaskTableFilters = {
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  project: string;
};

export const DEFAULT_TASK_TABLE_FILTERS: TaskTableFilters = {
  status: "all",
  priority: "all",
  assignee: "all",
  dueDate: "all",
  project: "all",
};

export const WORKSPACE_TASKS: WorkspaceTask[] = [
  {
    id: "1",
    taskCode: "FS-101",
    title: "Modernize Authentication Flow",
    project: "Project Omega",
    projectId: "1",
    assignee: { id: "sarah-jenkins", name: "Sarah Jenkins", initials: "SJ" },
    priority: "critical",
    status: "in_progress",
    dueDate: "2023-10-12",
  },
  {
    id: "2",
    taskCode: "FS-102",
    title: "API Endpoint Documentation",
    project: "Project Omega",
    projectId: "1",
    assignee: { id: "michael-chen", name: "Michael Chen", initials: "MC" },
    priority: "high",
    status: "todo",
    dueDate: "2023-10-15",
  },
  {
    id: "3",
    taskCode: "FS-103",
    title: "QA Regression Test: Module B",
    project: "Security Audit 2024",
    projectId: "3",
    assignee: { id: "elena-rodriguez", name: "Elena Rodriguez", initials: "ER" },
    priority: "medium",
    status: "review",
    dueDate: "2023-10-11",
  },
  {
    id: "4",
    taskCode: "FS-104",
    title: "Assets Compression Script",
    project: "Legacy Migration",
    projectId: "4",
    assignee: { id: "david-miller", name: "David Miller", initials: "DM" },
    priority: "low",
    status: "done",
    dueDate: "2023-10-09",
  },
  {
    id: "5",
    taskCode: "FS-105",
    title: "Landing Page SEO Audit",
    project: "Mars Landing App",
    projectId: "2",
    assignee: { id: "chloe-sterling", name: "Chloe Sterling", initials: "CS" },
    priority: "medium",
    status: "in_progress",
    dueDate: "2023-10-18",
  },
  {
    id: "6",
    taskCode: "FS-106",
    title: "Stripe Webhook Signature Verification",
    project: "Project Omega",
    projectId: "1",
    assignee: { id: "michael-chen", name: "Michael Chen", initials: "MC" },
    priority: "high",
    status: "in_progress",
    dueDate: "2023-10-20",
  },
  {
    id: "7",
    taskCode: "FS-107",
    title: "Workspace Dashboard Metrics API",
    project: "Mars Landing App",
    projectId: "2",
    assignee: { id: "sarah-jenkins", name: "Sarah Jenkins", initials: "SJ" },
    priority: "medium",
    status: "todo",
    dueDate: "2023-10-22",
  },
  {
    id: "8",
    taskCode: "FS-108",
    title: "Kanban Column Drag and Drop",
    project: "Legacy Migration",
    projectId: "4",
    assignee: { id: "elena-rodriguez", name: "Elena Rodriguez", initials: "ER" },
    priority: "high",
    status: "review",
    dueDate: "2023-10-19",
  },
  {
    id: "9",
    taskCode: "FS-109",
    title: "Organization Table Export CSV",
    project: "Project Omega",
    projectId: "1",
    assignee: { id: "david-miller", name: "David Miller", initials: "DM" },
    priority: "low",
    status: "done",
    dueDate: "2023-10-08",
  },
  {
    id: "10",
    taskCode: "FS-110",
    title: "Email Notification Templates",
    project: "Mars Landing App",
    projectId: "2",
    assignee: { id: "chloe-sterling", name: "Chloe Sterling", initials: "CS" },
    priority: "medium",
    status: "todo",
    dueDate: "2023-10-25",
  },
  {
    id: "11",
    taskCode: "FS-111",
    title: "Role-Based Sidebar Navigation",
    project: "Security Audit 2024",
    projectId: "3",
    assignee: { id: "sarah-jenkins", name: "Sarah Jenkins", initials: "SJ" },
    priority: "critical",
    status: "in_progress",
    dueDate: "2023-10-14",
  },
  {
    id: "12",
    taskCode: "FS-112",
    title: "Project Detail Activity Feed",
    project: "Project Omega",
    projectId: "1",
    assignee: { id: "michael-chen", name: "Michael Chen", initials: "MC" },
    priority: "medium",
    status: "done",
    dueDate: "2023-10-07",
  },
  {
    id: "13",
    taskCode: "FS-113",
    title: "Mobile Filter Drawer UX",
    project: "Legacy Migration",
    projectId: "4",
    assignee: { id: "elena-rodriguez", name: "Elena Rodriguez", initials: "ER" },
    priority: "low",
    status: "todo",
    dueDate: "2023-10-28",
  },
  {
    id: "14",
    taskCode: "FS-114",
    title: "Subscription Renewal Reminders",
    project: "Mars Landing App",
    projectId: "2",
    assignee: { id: "chloe-sterling", name: "Chloe Sterling", initials: "CS" },
    priority: "high",
    status: "review",
    dueDate: "2023-10-16",
  },
  {
    id: "15",
    taskCode: "FS-115",
    title: "Audit Log Retention Policy",
    project: "Security Audit 2024",
    projectId: "3",
    assignee: { id: "david-miller", name: "David Miller", initials: "DM" },
    priority: "medium",
    status: "in_progress",
    dueDate: "2023-10-21",
  },
  {
    id: "16",
    taskCode: "FS-116",
    title: "Task Table Bulk Actions",
    project: "Mars Landing App",
    projectId: "2",
    assignee: { id: "sarah-jenkins", name: "Sarah Jenkins", initials: "SJ" },
    priority: "high",
    status: "todo",
    dueDate: "2023-10-23",
  },
  {
    id: "17",
    taskCode: "FS-117",
    title: "Calendar Sync with Google",
    project: "Legacy Migration",
    projectId: "4",
    assignee: { id: "michael-chen", name: "Michael Chen", initials: "MC" },
    priority: "low",
    status: "done",
    dueDate: "2023-10-06",
  },
  {
    id: "18",
    taskCode: "FS-118",
    title: "Onboarding Checklist Widget",
    project: "Mars Landing App",
    projectId: "2",
    assignee: { id: "elena-rodriguez", name: "Elena Rodriguez", initials: "ER" },
    priority: "medium",
    status: "in_progress",
    dueDate: "2023-10-24",
  },
];
