import { lazy, type ComponentType } from "react";

export type WorkspaceRoute = {
  path: string;
  name: string;
  component: ComponentType;
};

export const WORKSPACE_ROUTES = {
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  PROJECT_CREATE: "/projects/new",
  PROJECT_EDIT: "/projects/:projectId/edit",
  PROJECT_DETAIL: "/projects/:projectId",
  PROJECT_THEME: "/projects/:projectId/theme",
  PROJECT_BOARD: "/projects/:projectId/board",
  BOARDS: "/boards",
  TASKS: "/tasks",
  MY_TASKS: "/my-tasks",
  TASK_CREATE: "/tasks/new",
  TASK_DETAIL: "/tasks/:taskId",
  TASK_EDIT: "/tasks/:taskId/edit",
  TEAMS: "/teams",
  CALENDAR: "/calendar",
  REPORTS: "/reports",
  BILLING: "/billing",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  ACTIVITY_LOGS: "/activity-logs",
} as const;

type WorkspaceRouteKey = keyof typeof WORKSPACE_ROUTES;

type WorkspaceRouteConfig = {
  key: WorkspaceRouteKey;
  pageFile?: string;
};

const WORKSPACE_ROUTE_CONFIGS: WorkspaceRouteConfig[] = [
  { key: "DASHBOARD" },
  { key: "PROJECT_CREATE", pageFile: "project-create" },
  { key: "PROJECT_EDIT", pageFile: "project-edit" },
  { key: "PROJECT_BOARD", pageFile: "project-board" },
  { key: "PROJECT_THEME", pageFile: "project-settings" },
  { key: "PROJECT_DETAIL", pageFile: "project-detail" },
  { key: "PROJECTS" },
  { key: "BOARDS" },
  { key: "TASK_CREATE", pageFile: "task-create" },
  { key: "TASK_EDIT", pageFile: "task-edit" },
  { key: "TASK_DETAIL", pageFile: "task-detail" },
  { key: "TASKS" },
  { key: "MY_TASKS" },
  { key: "TEAMS" },
  { key: "CALENDAR" },
  { key: "REPORTS" },
  { key: "BILLING" },
  { key: "SETTINGS" },
  { key: "PROFILE" },
  { key: "ACTIVITY_LOGS" },
];

function resolveWorkspacePageFile(key: WorkspaceRouteKey, pageFile?: string) {
  if (pageFile) return pageFile;

  return WORKSPACE_ROUTES[key].replace(/^\//, "");
}

function createWorkspaceRoutes(configs: readonly WorkspaceRouteConfig[]): WorkspaceRoute[] {
  return configs.map(({ key, pageFile }) => ({
    path: WORKSPACE_ROUTES[key],
    name: key,
    component: lazy(() => import(`../pages/workspace/${resolveWorkspacePageFile(key, pageFile)}.tsx`)),
  }));
}

export const WORKSPACE_ROUTES_LIST = createWorkspaceRoutes(WORKSPACE_ROUTE_CONFIGS);

export const WORKSPACE_NOT_FOUND_ROUTE: WorkspaceRoute = {
  path: "*",
  name: "NOT_FOUND",
  component: lazy(() => import("../component/workspace/workspace-not-found")),
};

export const WORKSPACE_LEGACY_REDIRECTS = WORKSPACE_ROUTES_LIST.map((route) => ({
  path: `/app${route.path}`,
  to: route.path,
}));
