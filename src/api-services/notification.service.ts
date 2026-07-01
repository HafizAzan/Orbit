import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type { WorkspaceNotification } from "../data/workspace-notifications";

const AUTH_REQUEST = { requireAuth: true } as const;

export type ApiNotification = WorkspaceNotification & {
  resourceType?: string | null;
  resourceId?: string | null;
  createdAt: string;
};

const listNotifications = async (): Promise<ApiNotification[]> => {
  const response = await ApiService.get(API_ROUTES.NOTIFICATIONS.LIST, AUTH_REQUEST);
  return assertApiSuccess<ApiNotification[]>(response);
};

const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await ApiService.get(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT, AUTH_REQUEST);
  const payload = assertApiSuccess<{ count: number }>(response);
  return payload.count;
};

const markNotificationAsRead = async (notificationId: string) => {
  const response = await ApiService.patch(
    `${API_ROUTES.NOTIFICATIONS.LIST}/${notificationId}/read`,
    undefined,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ApiNotification>(response);
};

const markAllNotificationsAsRead = async () => {
  const response = await ApiService.patch(API_ROUTES.NOTIFICATIONS.READ_ALL, undefined, AUTH_REQUEST);
  return assertApiSuccess<{ message: string }>(response);
};

export {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
};
