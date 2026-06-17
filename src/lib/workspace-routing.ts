import type { RegisterAs } from "../types/auth.types";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";

export function getWorkspaceRoleLabel(role: RegisterAs) {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "member":
      return "Member";
    default:
      return "User";
  }
}

export function isWorkspaceUser(user: { role: RegisterAs; isPlatformAdmin: boolean }) {
  return user.role !== "super_admin" && !user.isPlatformAdmin;
}

export function isWorkspaceOwner(user: { role: RegisterAs }) {
  return user.role === "owner";
}

export function getWorkspaceBrandSubtitle(organizationName?: string | null) {
  if (organizationName?.trim()) {
    return organizationName.trim();
  }

  return "Enterprise Workspace";
}

export function getWorkspaceHomePath(role?: RegisterAs) {
  if (role === "member") {
    return WORKSPACE_ROUTES.MY_TASKS;
  }

  return WORKSPACE_ROUTES.DASHBOARD;
}

export function getWorkspaceTaskHubPath(role?: RegisterAs) {
  if (role === "member") {
    return WORKSPACE_ROUTES.MY_TASKS;
  }

  return WORKSPACE_ROUTES.TASKS;
}

export function getProjectWorkspacePath(role: RegisterAs | undefined, projectId: string) {
  if (role === "member") {
    return `${WORKSPACE_ROUTES.PROJECTS}/${projectId}/board`;
  }

  return `${WORKSPACE_ROUTES.PROJECTS}/${projectId}`;
}
