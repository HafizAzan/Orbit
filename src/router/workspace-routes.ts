import { lazy } from "react";

export type WorkspaceRoute = {
  path: string;
  name: string;
  component: React.ComponentType;
};

export const WORKSPACE_ROUTES = {
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  PROJECT_CREATE: "/projects/new",
  PROJECT_EDIT: "/projects/:projectId/edit",
  PROJECT_DETAIL: "/projects/:projectId",
  PROJECT_BOARD: "/projects/:projectId/board",
  BOARDS: "/boards",
  TASKS: "/tasks",
  MY_TASKS: "/my-tasks",
  TASK_CREATE: "/tasks/new",
  TASK_EDIT: "/tasks/:taskId/edit",
  TEAMS: "/teams",
  CALENDAR: "/calendar",
  REPORTS: "/reports",
  BILLING: "/billing",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;

const WORKSPACE_ROUTE_KEYS = [
  "DASHBOARD",
  "PROJECTS",
  "BOARDS",
  "TASKS",
  "MY_TASKS",
  "TEAMS",
  "CALENDAR",
  "REPORTS",
  "BILLING",
  "SETTINGS",
  "PROFILE",
] as const;

function resolveWorkspacePageImport(key: string) {
  const routePath = WORKSPACE_ROUTES[key as keyof typeof WORKSPACE_ROUTES];
  const fileName = routePath.replace(/^\//, "");

  return import(`../pages/workspace/${fileName}.tsx`);
}

function createWorkspaceRoutes(keys: readonly string[]): WorkspaceRoute[] {
  return keys.map((key) => ({
    path: WORKSPACE_ROUTES[key as keyof typeof WORKSPACE_ROUTES],
    name: key,
    component: lazy(() => resolveWorkspacePageImport(key)),
  }));
}

export const WORKSPACE_ROUTES_LIST = createWorkspaceRoutes(WORKSPACE_ROUTE_KEYS);
