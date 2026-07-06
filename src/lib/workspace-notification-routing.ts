import type { ApiNotification } from "../api-services/notification.service";
import { getProjectDetailPath } from "../data/workspace-project-detail";
import { getTaskDetailPath } from "../data/workspace-task-form";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";
import type { RegisterAs } from "../types/auth.types";

function isActivityLogHref(href: string) {
  return href === WORKSPACE_ROUTES.ACTIVITY_LOGS || href.startsWith(`${WORKSPACE_ROUTES.ACTIVITY_LOGS}/`);
}

export function resolveWorkspaceNotificationHref(
  notification: Pick<ApiNotification, "kind" | "href" | "resourceType" | "resourceId">,
  role: RegisterAs | undefined,
): string | null {
  const resourceId = notification.resourceId ?? undefined;

  if (notification.kind === "task" && resourceId) {
    return getTaskDetailPath(resourceId);
  }

  if (notification.kind === "project" && resourceId) {
    return getProjectDetailPath(resourceId);
  }

  if (notification.kind === "comment" && resourceId) {
    return `${getProjectDetailPath(resourceId)}#discussion`;
  }

  if (role === "member") {
    if (notification.kind === "team") {
      return WORKSPACE_ROUTES.MY_TASKS;
    }

    if (notification.kind === "calendar") {
      return WORKSPACE_ROUTES.CALENDAR;
    }

    if (notification.href && isActivityLogHref(notification.href)) {
      return null;
    }
  }

  return notification.href ?? null;
}
