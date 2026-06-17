import type {
  ProjectPriority,
  ProjectStatus,
  ProjectTeamMember,
  WorkspaceProject,
} from "../data/workspace-projects";
import type { ProjectCategory, ProjectFormValues, ProjectVisibility } from "../data/workspace-project-form";

export type ApiWorkspaceProject = {
  id: string;
  title: string;
  description: string;
  key: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  teamId: string;
  progress: number;
  dueDate: string | null;
  startDate: string | null;
  taskCount: number;
  commentCount: number;
  icon: WorkspaceProject["icon"];
  iconBg: string;
  iconColor: string;
  leadUserId: string | null;
  createdById: string;
  members: Array<ProjectTeamMember & { email?: string; projectRole?: string }>;
  viewerRole: "admin" | "member" | "viewer" | "org_admin" | null;
};

export type AssignableProjectMember = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

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
};

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  progress?: number;
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
    memberIds: project.members.map((member) => member.id),
  };
}
