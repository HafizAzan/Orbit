import type { ProjectPriority, ProjectTeamMember, WorkspaceProject } from "./workspace-projects";

export type ProjectVisibility = "private" | "public";

export type ProjectCategory = "marketing" | "engineering" | "design" | "product" | "operations";

export type ProjectFormValues = {
  name: string;
  key: string;
  description: string;
  category: ProjectCategory;
  priority: ProjectPriority;
  startDate: string;
  dueDate: string;
  visibility: ProjectVisibility;
  memberIds: string[];
};

export type AssignableProjectMember = ProjectTeamMember & {
  email: string;
};

export const PROJECT_CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
  { value: "marketing", label: "Marketing" },
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "operations", label: "Operations" },
];

export const PROJECT_PRIORITY_OPTIONS: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const PROJECT_VISIBILITY_OPTIONS: {
  value: ProjectVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "private",
    label: "Private",
    description: "Only project members can see and access this workspace.",
  },
  {
    value: "public",
    label: "Public",
    description: "Everyone in FlowSync can browse and join this project.",
  },
];

export const ASSIGNABLE_PROJECT_MEMBERS: AssignableProjectMember[] = [
  { id: "m1", name: "Alex Rivera", email: "alex.rivera@flowsync.io", avatarColor: "bg-sky-100 text-sky-700" },
  { id: "m2", name: "Sarah Chen", email: "sarah.chen@flowsync.io", avatarColor: "bg-violet-100 text-violet-700" },
  { id: "m3", name: "Marcus Chen", email: "marcus.chen@flowsync.io", avatarColor: "bg-indigo-100 text-indigo-700" },
  { id: "m4", name: "Elena Rodriguez", email: "elena.rodriguez@flowsync.io", avatarColor: "bg-amber-100 text-amber-700" },
  { id: "m5", name: "David Kim", email: "david.kim@flowsync.io", avatarColor: "bg-emerald-100 text-emerald-700" },
  { id: "m6", name: "Priya Sharma", email: "priya.sharma@flowsync.io", avatarColor: "bg-rose-100 text-rose-700" },
];

export const DEFAULT_PROJECT_FORM_VALUES: ProjectFormValues = {
  name: "",
  key: "",
  description: "",
  category: "marketing",
  priority: "medium",
  startDate: "",
  dueDate: "",
  visibility: "private",
  memberIds: [],
};

const TEAM_ID_TO_CATEGORY: Record<string, ProjectCategory> = {
  design: "design",
  mobile: "engineering",
  security: "operations",
  platform: "engineering",
};

export function generateProjectKey(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();

  return words
    .slice(0, 4)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export function mapProjectToFormValues(project: WorkspaceProject): ProjectFormValues {
  const dueDate = new Date(`${project.dueDate}T00:00:00`);
  const startDate = new Date(dueDate);
  startDate.setMonth(startDate.getMonth() - 3);

  const memberIds = project.members
    .map((member) => ASSIGNABLE_PROJECT_MEMBERS.find((candidate) => candidate.name === member.name)?.id)
    .filter((id): id is string => Boolean(id));

  return {
    name: project.title,
    key: generateProjectKey(project.title),
    description: project.description,
    category: TEAM_ID_TO_CATEGORY[project.teamId] ?? "product",
    priority: project.priority,
    startDate: startDate.toISOString().slice(0, 10),
    dueDate: project.dueDate,
    visibility: "private",
    memberIds: memberIds.length > 0 ? memberIds : ["m1"],
  };
}

export function getProjectCreatePath() {
  return "/projects/new";
}

export function getProjectEditPath(projectId: string) {
  return `/projects/${projectId}/edit`;
}
