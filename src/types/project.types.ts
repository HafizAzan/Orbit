import type { ProjectPriority, ProjectStatus, ProjectTeamMember, WorkspaceProject } from "../data/workspace-projects";
import type { ProjectCategory, ProjectFormValues, ProjectVisibility } from "../data/workspace-project-form";
import type { ProjectThemeId } from "../data/project-themes";
import type { RegisterAs } from "./auth.types";

export type ApiProjectThemeMeta = {
  accent: string;
  accentSoft: string;
  accentText: string;
  headerFrom: string;
  headerTo: string;
  cardBorder: string;
  pillBg: string;
  previewGradient: string;
};

export type ApiWorkspaceProject = {
  id: string;
  title: string;
  description: string;
  key: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  theme: ProjectThemeId;
  teamId: string;
  progress: number;
  dueDate: string | null;
  startDate: string | null;
  taskCount: number;
  completedTaskCount: number;
  totalEstimatedHours: number;
  commentCount: number;
  icon: WorkspaceProject["icon"];
  iconBg: string;
  iconColor: string;
  themeMeta: ApiProjectThemeMeta;
  leadUserId: string | null;
  createdById: string;
  members: Array<
    ProjectTeamMember & {
      email?: string;
      projectRole?: string;
      /** Organization role when provided by API. */
      role?: RegisterAs;
    }
  >;
  viewerRole: "admin" | "member" | "viewer" | "org_admin" | null;
};

export type AssignableProjectMember = {
  id: string;
  name: string;
  email: string;
  role: RegisterAs;
  avatarColor: string;
};

export type ListProjectsParams = {
  page?: number;
  limit?: number;
};

export type PaginatedProjectsResponse = {
  data: ApiWorkspaceProject[];
  page: number;
  limit: number;
  total: number;
};

export const DEFAULT_PROJECTS_PAGE = 1;
export const DEFAULT_PROJECTS_PAGE_SIZE = 6;

export const DEFAULT_PROJECTS_LIST_PARAMS = {
  page: DEFAULT_PROJECTS_PAGE,
  limit: DEFAULT_PROJECTS_PAGE_SIZE,
} as const;

export type CreateProjectRequest = {
  name: string;
  key: string;
  description?: string;
  category?: ProjectCategory;
  priority?: ProjectPriority;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  startDate?: string;
  dueDate?: string;
  memberIds?: string[];
  leadUserId?: string;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  progress?: number;
};

export type UpdateMyProjectThemeRequest = {
  theme: ProjectThemeId;
};

export function mapApiProjectToWorkspaceProject(project: ApiWorkspaceProject): WorkspaceProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    priority: project.priority,
    teamId: project.teamId,
    progress: project.progress,
    dueDate: project.dueDate ?? "",
    taskCount: project.taskCount,
    commentCount: project.commentCount,
    icon: project.icon,
    iconBg: project.iconBg,
    iconColor: project.iconColor,
    members: project.members.map(({ id, name, avatarColor }) => ({
      id,
      name,
      avatarColor,
    })),
  };
}

export function mapFormValuesToCreateRequest(values: ProjectFormValues): CreateProjectRequest {
  return {
    name: values.name.trim(),
    key: values.key.trim().toUpperCase(),
    description: values.description.trim(),
    category: values.category,
    priority: values.priority,
    visibility: values.visibility,
    startDate: values.startDate || undefined,
    dueDate: values.dueDate || undefined,
    memberIds: values.memberIds,
    leadUserId: values.leadUserId ?? undefined,
  };
}

export function mapApiProjectToFormValues(project: ApiWorkspaceProject): ProjectFormValues {
  return {
    name: project.title,
    key: project.key,
    description: project.description,
    category: project.category,
    priority: project.priority,
    startDate: project.startDate ?? "",
    dueDate: project.dueDate ?? "",
    visibility: project.visibility,
    leadUserId: project.leadUserId,
    memberIds: project.members
      .filter((member) => {
        if (member.id === project.leadUserId) return false;
        // Prefer org role when present so managers only keep true members in squad selection.
        if (member.role) return member.role === "member";
        return true;
      })
      .map((member) => member.id),
  };
}
