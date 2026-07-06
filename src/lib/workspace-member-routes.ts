import { WORKSPACE_ROUTES } from "../router/workspace-routes";

const MEMBER_EXACT_PATHS: readonly string[] = [
  WORKSPACE_ROUTES.MY_TASKS,
  WORKSPACE_ROUTES.CALENDAR,
  WORKSPACE_ROUTES.PROFILE,
  WORKSPACE_ROUTES.BOARDS,
  WORKSPACE_ROUTES.TASK_CREATE,
];

const MEMBER_BLOCKED_PATHS: readonly string[] = [WORKSPACE_ROUTES.ACTIVITY_LOGS];

const MEMBER_PATH_PATTERNS = [
  /^\/tasks\/[^/]+$/,
  /^\/tasks\/[^/]+\/edit$/,
  /^\/projects\/[^/]+$/,
  /^\/projects\/[^/]+\/board$/,
];

export function isMemberAllowedPath(pathname: string) {
  if (MEMBER_BLOCKED_PATHS.includes(pathname)) return false;
  if (MEMBER_EXACT_PATHS.includes(pathname)) return true;
  return MEMBER_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function getMemberFallbackPath() {
  return WORKSPACE_ROUTES.MY_TASKS;
}
