import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";

export type WorkspaceNavigationState = {
  from?: string;
  fromLabel?: string;
};

const WORKSPACE_PATH_LABELS: Record<string, string> = {
  [WORKSPACE_ROUTES.DASHBOARD]: "Dashboard",
  [WORKSPACE_ROUTES.PROJECTS]: "Projects",
  [WORKSPACE_ROUTES.BOARDS]: "Boards",
  [WORKSPACE_ROUTES.TASKS]: "Tasks",
  [WORKSPACE_ROUTES.TEAMS]: "Teams",
  [WORKSPACE_ROUTES.CALENDAR]: "Calendar",
  [WORKSPACE_ROUTES.REPORTS]: "Reports",
  [WORKSPACE_ROUTES.SETTINGS]: "Settings",
  [WORKSPACE_ROUTES.PROFILE]: "Profile",
  [WORKSPACE_ROUTES.PROJECT_CREATE]: "Create Project",
  [WORKSPACE_ROUTES.TASK_CREATE]: "Create Task",
};

function isInternalWorkspacePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function getWorkspacePathLabel(path: string) {
  if (WORKSPACE_PATH_LABELS[path]) {
    return WORKSPACE_PATH_LABELS[path];
  }

  if (path === WORKSPACE_ROUTES.PROJECT_CREATE) {
    return "Create Project";
  }

  if (path === WORKSPACE_ROUTES.TASK_CREATE) {
    return "Create Task";
  }

  if (/^\/projects\/[^/]+\/edit$/.test(path)) {
    return "Edit Project";
  }

  if (/^\/projects\/[^/]+\/board$/.test(path)) {
    return "Board";
  }

  if (/^\/projects\/[^/]+$/.test(path) && path !== WORKSPACE_ROUTES.PROJECT_CREATE) {
    return "Project";
  }

  if (/^\/tasks\/[^/]+\/edit$/.test(path)) {
    return "Edit Task";
  }

  return undefined;
}

export function createWorkspaceNavState(fromPath: string, fromLabel?: string) {
  return {
    state: {
      from: fromPath,
      fromLabel: fromLabel ?? getWorkspacePathLabel(fromPath),
    } satisfies WorkspaceNavigationState,
  };
}

export function resolveWorkspaceReturn(
  state: unknown,
  fallbackPath: string,
  fallbackLabel: string,
) {
  const navState = (state ?? {}) as WorkspaceNavigationState;
  const path =
    navState.from && isInternalWorkspacePath(navState.from) ? navState.from : fallbackPath;
  const label = navState.fromLabel ?? getWorkspacePathLabel(path) ?? fallbackLabel;

  return { path, label };
}

export function preserveWorkspaceNavState(state: unknown, currentPath: string) {
  const navState = (state ?? {}) as WorkspaceNavigationState;

  if (navState.from && isInternalWorkspacePath(navState.from)) {
    return createWorkspaceNavState(navState.from, navState.fromLabel);
  }

  return createWorkspaceNavState(currentPath, getWorkspacePathLabel(currentPath));
}

export function useWorkspaceReturnTo(fallbackPath: string, fallbackLabel: string) {
  const location = useLocation();
  const navigate = useNavigate();

  const { path: returnPath, label: returnLabel } = useMemo(
    () => resolveWorkspaceReturn(location.state, fallbackPath, fallbackLabel),
    [fallbackLabel, fallbackPath, location.state],
  );

  const goBack = useCallback(() => {
    navigate(returnPath);
  }, [navigate, returnPath]);

  return { returnPath, returnLabel, goBack };
}

export function useCurrentWorkspaceNavState() {
  const location = useLocation();

  return useMemo(
    () => createWorkspaceNavState(location.pathname, getWorkspacePathLabel(location.pathname)),
    [location.pathname],
  );
}
