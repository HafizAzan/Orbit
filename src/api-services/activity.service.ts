import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type { ActivityFeedItem, ActivityListResponse } from "../types/activity.types";
import {
  buildPaginationSearchParams,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const getActivityFeed = async (): Promise<ActivityFeedItem[]> => {
  const response = await ApiService.get(API_ROUTES.ACTIVITY.FEED, AUTH_REQUEST);
  return assertApiSuccess<ActivityFeedItem[]>(response);
};

const getActivities = async (params: PaginationParams = {}): Promise<ActivityListResponse> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.ACTIVITY.LIST}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ActivityListResponse>(response);
};

const deleteActivity = async (activityId: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.ACTIVITY.LIST}/${activityId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

export { deleteActivity, getActivities, getActivityFeed };
