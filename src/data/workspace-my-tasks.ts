import type { WorkspaceTaskAssignee, WorkspaceTaskPriority, WorkspaceTaskStatus } from "./workspace-tasks";
import { TASK_PRIORITY_CONFIG, TASK_PROJECT_FILTER_OPTIONS, TASK_STATUS_CONFIG } from "./workspace-tasks";

export type MyTaskBucket = "due_today" | "assigned" | "upcoming" | "completed";

export type MyTaskIcon = "rocket" | "chart" | "shield" | "default";

export type MyTaskCollaborator = WorkspaceTaskAssignee & {
  avatarColor?: string;
};

export type MyTask = {
  id: string;
  taskCode: string;
  title: string;
  description?: string;
  project: string;
  projectId: string;
  assignee: WorkspaceTaskAssignee;
  collaborators?: MyTaskCollaborator[];
  priority: WorkspaceTaskPriority;
  status: WorkspaceTaskStatus;
  dueDate: string;
  dueTime?: string;
  bucket: MyTaskBucket;
  icon?: MyTaskIcon;
  tags?: string[];
};

export type MyTasksFilters = {
  status: string;
  priority: string;
  project: string;
};

export const DEFAULT_MY_TASKS_FILTERS: MyTasksFilters = {
  status: "all",
  priority: "all",
  project: "all",
};

export const MY_TASKS_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export const MY_TASKS_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  ...Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export const MY_TASKS_PROJECT_FILTER_OPTIONS = TASK_PROJECT_FILTER_OPTIONS;

/** Default mock assignee id for member demo tasks */
export const DEFAULT_MEMBER_ASSIGNEE_ID = "michael-chen";

export const MEMBER_ASSIGNEE_DIRECTORY: Record<string, WorkspaceTaskAssignee> = {
  "michael-chen": { id: "michael-chen", name: "Michael Chen", initials: "MC" },
  "sarah-jenkins": { id: "sarah-jenkins", name: "Sarah Jenkins", initials: "SJ" },
  "elena-rodriguez": { id: "elena-rodriguez", name: "Elena Rodriguez", initials: "ER" },
  "david-miller": { id: "david-miller", name: "David Miller", initials: "DM" },
  "chloe-sterling": { id: "chloe-sterling", name: "Chloe Sterling", initials: "CS" },
};

const COLLABORATOR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

function collaborators(ids: string[]): MyTaskCollaborator[] {
  return ids.map((id, index) => ({
    ...MEMBER_ASSIGNEE_DIRECTORY[id],
    avatarColor: COLLABORATOR_COLORS[index % COLLABORATOR_COLORS.length],
  }));
}

export const MY_TASKS: MyTask[] = [
  {
    id: "mt-1",
    taskCode: "FS-201",
    title: "Redesign onboarding flow",
    description: "Update the first-run experience with a clearer checklist and progress indicator.",
    project: "Project Omega",
    projectId: "1",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    collaborators: collaborators(["sarah-jenkins", "elena-rodriguez", "david-miller"]),
    priority: "critical",
    status: "in_progress",
    dueDate: "2024-10-15",
    dueTime: "Today",
    bucket: "due_today",
  },
  {
    id: "mt-2",
    taskCode: "FS-202",
    title: "Update landing page hero copy",
    description: "Align messaging with the Q4 campaign and refresh the primary CTA.",
    project: "Marketing Core",
    projectId: "2",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    collaborators: collaborators(["sarah-jenkins", "chloe-sterling"]),
    priority: "critical",
    status: "todo",
    dueDate: "2024-10-15",
    dueTime: "Today, 5:00 PM",
    bucket: "due_today",
  },
  {
    id: "mt-3",
    taskCode: "FS-203",
    title: "Submit Q4 performance self-review",
    description: "Complete the self-assessment form and attach key delivery highlights.",
    project: "HR Portal",
    projectId: "3",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    collaborators: collaborators(["elena-rodriguez"]),
    priority: "high",
    status: "todo",
    dueDate: "2024-10-15",
    dueTime: "Oct 15 (Today)",
    bucket: "due_today",
  },
  {
    id: "mt-4",
    taskCode: "FS-204",
    title: "Audit security protocols for API v3",
    project: "Project Alpha",
    projectId: "1",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-10-18",
    bucket: "assigned",
  },
  {
    id: "mt-5",
    taskCode: "FS-205",
    title: "Update internal documentation for SSO rollout",
    project: "IT Infrastructure",
    projectId: "4",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "low",
    status: "todo",
    dueDate: "2024-10-20",
    bucket: "assigned",
  },
  {
    id: "mt-6",
    taskCode: "FS-206",
    title: "Review pull request: notification batching",
    project: "Project Omega",
    projectId: "1",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium",
    status: "review",
    dueDate: "2024-10-17",
    bucket: "assigned",
  },
  {
    id: "mt-7",
    taskCode: "FS-207",
    title: "Prepare sprint demo talking points",
    project: "Mars Landing App",
    projectId: "2",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "high",
    status: "todo",
    dueDate: "2024-10-19",
    bucket: "assigned",
  },
  {
    id: "mt-8",
    taskCode: "FS-208",
    title: "Fix mobile spacing on task cards",
    project: "Legacy Migration",
    projectId: "4",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-10-16",
    bucket: "assigned",
  },
  {
    id: "mt-9",
    taskCode: "FS-209",
    title: "Sync design tokens with Figma library",
    project: "Project Omega",
    projectId: "1",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "low",
    status: "todo",
    dueDate: "2024-10-21",
    bucket: "assigned",
  },
  {
    id: "mt-10",
    taskCode: "FS-210",
    title: "Validate webhook retry policy in staging",
    project: "Security Audit 2024",
    projectId: "3",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "high",
    status: "review",
    dueDate: "2024-10-22",
    bucket: "assigned",
  },
  {
    id: "mt-11",
    taskCode: "FS-211",
    title: "Draft release notes for v2.4",
    project: "Mars Landing App",
    projectId: "2",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium",
    status: "todo",
    dueDate: "2024-10-23",
    bucket: "assigned",
  },
  {
    id: "mt-12",
    taskCode: "FS-212",
    title: "Launch roadmap planning workshop",
    project: "Marketing Core",
    projectId: "2",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium",
    status: "todo",
    dueDate: "2024-10-28",
    bucket: "upcoming",
    icon: "rocket",
    tags: ["Planning stage"],
  },
  {
    id: "mt-13",
    taskCode: "FS-213",
    title: "Quarterly budget reconciliation",
    project: "Finance Ops",
    projectId: "3",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "high",
    status: "todo",
    dueDate: "2024-11-02",
    bucket: "upcoming",
    icon: "chart",
    tags: ["Recursive"],
  },
  {
    id: "mt-14",
    taskCode: "FS-214",
    title: "Pen-test remediation follow-up",
    project: "Security Audit 2024",
    projectId: "3",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "high",
    status: "todo",
    dueDate: "2024-11-05",
    bucket: "upcoming",
    icon: "shield",
  },
  {
    id: "mt-15",
    taskCode: "FS-215",
    title: "Customer onboarding survey analysis",
    project: "Project Omega",
    projectId: "1",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium",
    status: "todo",
    dueDate: "2024-11-08",
    bucket: "upcoming",
    icon: "chart",
  },
  ...Array.from({ length: 124 }, (_, index) => ({
    id: `mt-done-${index + 1}`,
    taskCode: `FS-${300 + index}`,
    title: `Completed delivery item ${index + 1}`,
    project: index % 2 === 0 ? "Project Omega" : "Mars Landing App",
    projectId: index % 2 === 0 ? "1" : "2",
    assignee: MEMBER_ASSIGNEE_DIRECTORY["michael-chen"],
    priority: "medium" as WorkspaceTaskPriority,
    status: "done" as WorkspaceTaskStatus,
    dueDate: "2024-09-30",
    bucket: "completed" as MyTaskBucket,
  })),
];

export function resolveMemberAssigneeId(userName?: string | null) {
  if (!userName?.trim()) return DEFAULT_MEMBER_ASSIGNEE_ID;

  const normalized = userName.trim().toLowerCase();
  const match = Object.values(MEMBER_ASSIGNEE_DIRECTORY).find(
    (assignee) => assignee.name.toLowerCase() === normalized,
  );

  return match?.id ?? DEFAULT_MEMBER_ASSIGNEE_ID;
}

export function getMyTasksForAssignee(assigneeId: string, tasks: MyTask[] = MY_TASKS) {
  return tasks.filter((task) => task.assignee.id === assigneeId);
}
