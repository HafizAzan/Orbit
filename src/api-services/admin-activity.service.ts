import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  ActivityFlagReason,
  ActivityRecord,
  ActivityReviewStatus,
} from "../data/admin-activity";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

export type StatMetric = { value: number; percentage: number };

export type AdminActivityStats = {
  total: StatMetric;
  flagged: StatMetric;
  resolved: StatMetric;
  today: StatMetric;
};

export type FlagAdminActivityRequest = {
  reason: ActivityFlagReason;
  note?: string;
};

const listAdminActivityPage = async (
  params: PaginationParams & {
    search?: string;
    reviewStatus?: ActivityReviewStatus;
    flagged?: boolean;
  } = {},
): Promise<PaginatedResponse<ActivityRecord>> => {
  const searchParams = buildPaginationSearchParams(params);
  if (params.search) searchParams.set("search", params.search);
  if (params.reviewStatus) searchParams.set("reviewStatus", params.reviewStatus);
  if (params.flagged) searchParams.set("flagged", "true");
  const response = await ApiService.get(
    `${API_ROUTES.ADMIN.ACTIVITY}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ActivityRecord>(assertApiSuccess<unknown>(response));
};

const getAdminActivityStats = async (): Promise<AdminActivityStats> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.ACTIVITY_STATS, AUTH_REQUEST);
  return assertApiSuccess<AdminActivityStats>(response);
};

const flagAdminActivity = async (
  id: string,
  data: FlagAdminActivityRequest,
): Promise<ActivityRecord> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.ACTIVITY}/${id}/flag`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ActivityRecord>(response);
};

const resolveAdminActivity = async (id: string): Promise<ActivityRecord> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.ACTIVITY}/${id}/resolve`,
    {},
    AUTH_REQUEST,
  );
  return assertApiSuccess<ActivityRecord>(response);
};

const unflagAdminActivity = async (id: string): Promise<ActivityRecord> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.ACTIVITY}/${id}/unflag`,
    {},
    AUTH_REQUEST,
  );
  return assertApiSuccess<ActivityRecord>(response);
};

export {
  flagAdminActivity,
  getAdminActivityStats,
  listAdminActivityPage,
  resolveAdminActivity,
  unflagAdminActivity,
};
