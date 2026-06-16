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
      return "Member";
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

export function getWorkspaceHomePath() {
  return WORKSPACE_ROUTES.DASHBOARD;
}
