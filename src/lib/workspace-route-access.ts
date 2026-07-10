import type { RegisterAs } from "../types/auth.types";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";
import { canAccessPathWithPlan } from "./plan-features";
import {
  getWorkspacePermissions,
  hasWorkspacePermission,
  type WorkspacePermission,
} from "./workspace-permissions";

const WORKSPACE_ROUTE_PERMISSIONS: Record<string, WorkspacePermission | WorkspacePermission[]> = {
  [WORKSPACE_ROUTES.DASHBOARD]: "dashboard.view",
  [WORKSPACE_ROUTES.PROJECTS]: "project.view",
  [WORKSPACE_ROUTES.BOARDS]: "boards.view",
  [WORKSPACE_ROUTES.CALENDAR]: "calendar.view",
  [WORKSPACE_ROUTES.BILLING]: "billing.view",
  [WORKSPACE_ROUTES.SETTINGS]: "settings.view",
  [WORKSPACE_ROUTES.MY_TASKS]: "my_tasks.view",
  [WORKSPACE_ROUTES.TASKS]: "tasks.view_all",
  [WORKSPACE_ROUTES.REPORTS]: "reports.view",
  [WORKSPACE_ROUTES.TEAMS]: "team.view",
  [WORKSPACE_ROUTES.ACTIVITY_LOGS]: "activity.view",
};

const WORKSPACE_ROUTE_PATTERNS: Array<{ pattern: RegExp; permission: WorkspacePermission }> = [
  { pattern: /^\/projects\/new$/, permission: "project.create" },
  { pattern: /^\/projects\/[^/]+\/edit$/, permission: "project.edit" },
  { pattern: /^\/projects\/[^/]+$/, permission: "project.view" },
  { pattern: /^\/projects\/[^/]+\/board$/, permission: "boards.view" },
  { pattern: /^\/tasks\/new$/, permission: "task.create" },
  { pattern: /^\/tasks\/[^/]+\/edit$/, permission: "task.edit" },
  { pattern: /^\/tasks\/[^/]+$/, permission: "my_tasks.view" },
];

export function getRequiredRoutePermission(pathname: string): WorkspacePermission | null {
  const exact = WORKSPACE_ROUTE_PERMISSIONS[pathname];
  if (exact) {
    return Array.isArray(exact) ? exact[0] : exact;
  }

  const matched = WORKSPACE_ROUTE_PATTERNS.find(({ pattern }) => pattern.test(pathname));
  return matched?.permission ?? null;
}

export function canAccessWorkspacePath(
  role: RegisterAs | undefined,
  pathname: string,
  featureFlags?: readonly string[],
) {
  const permission = getRequiredRoutePermission(pathname);

  if (!permission) {
    return true;
  }

  if (permission === "my_tasks.view" && pathname.startsWith("/tasks/")) {
    const roleAllowed =
      hasWorkspacePermission(role, "my_tasks.view") || hasWorkspacePermission(role, "tasks.view_all");
    return roleAllowed && canAccessPathWithPlan(pathname, featureFlags);
  }

  return hasWorkspacePermission(role, permission) && canAccessPathWithPlan(pathname, featureFlags);
}

export function getWorkspacePermissionsForRole(role: RegisterAs | undefined) {
  return getWorkspacePermissions(role);
}
