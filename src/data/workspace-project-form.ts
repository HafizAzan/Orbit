import type { RegisterAs } from "../types/auth.types";
import type { ProjectPriority } from "./workspace-projects";

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
  leadUserId: string | null;
  memberIds: string[];
};

export type AssignableProjectMember = {
  id: string;
  name: string;
  email: string;
  role: RegisterAs;
  avatarColor: string;
};

export const PROJECT_LEAD_ROLES: RegisterAs[] = ["manager", "admin"];

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

export const DEFAULT_PROJECT_FORM_VALUES: ProjectFormValues = {
  name: "",
  key: "",
  description: "",
  category: "marketing",
  priority: "medium",
  startDate: "",
  dueDate: "",
  visibility: "private",
  leadUserId: null,
  memberIds: [],
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

export function getProjectCreatePath() {
  return "/projects/new";
}

export function getProjectEditPath(projectId: string) {
  return `/projects/${projectId}/edit`;
}
