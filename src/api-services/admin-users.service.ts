import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type { UserRecord, UserRole, UserStatus } from "../data/admin-users";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

export type StatMetric = { value: number; percentage: number };

export type AdminUserStats = {
  total: StatMetric;
  active: StatMetric;
  pending: StatMetric;
  suspended: StatMetric;
};

export type UpdateAdminUserStatusRequest = {
  status: UserStatus;
};

export type UpdateAdminUserRequest = {
  fullName?: string;
  role?: UserRole;
};

const ROLE_TO_REGISTER_AS: Record<UserRole, "admin" | "manager" | "member"> = {
  Admin: "admin",
  Manager: "manager",
  Member: "member",
};

const listAdminUsersPage = async (
  params: PaginationParams & { search?: string; status?: UserStatus; organizationId?: string } = {},
): Promise<PaginatedResponse<UserRecord>> => {
  const searchParams = buildPaginationSearchParams(params);
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.organizationId) searchParams.set("organizationId", params.organizationId);
  const response = await ApiService.get(
    `${API_ROUTES.ADMIN.USERS}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<UserRecord>(assertApiSuccess<unknown>(response));
};

const getAdminUser = async (id: string): Promise<UserRecord> => {
  const response = await ApiService.get(`${API_ROUTES.ADMIN.USERS}/${id}`, AUTH_REQUEST);
  return assertApiSuccess<UserRecord>(response);
};

const getAdminUserStats = async (): Promise<AdminUserStats> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.USER_STATS, AUTH_REQUEST);
  return assertApiSuccess<AdminUserStats>(response);
};

const updateAdminUserStatus = async (
  id: string,
  data: UpdateAdminUserStatusRequest,
): Promise<UserRecord> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.USERS}/${id}/status`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<UserRecord>(response);
};

const updateAdminUser = async (
  id: string,
  data: UpdateAdminUserRequest,
): Promise<UserRecord> => {
  const payload: { fullName?: string; role?: string } = {};
  if (data.fullName) payload.fullName = data.fullName;
  if (data.role) payload.role = ROLE_TO_REGISTER_AS[data.role];

  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.USERS}/${id}`,
    payload,
    AUTH_REQUEST,
  );
  return assertApiSuccess<UserRecord>(response);
};

const deleteAdminUser = async (id: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.ADMIN.USERS}/${id}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

export {
  deleteAdminUser,
  getAdminUser,
  getAdminUserStats,
  listAdminUsersPage,
  updateAdminUser,
  updateAdminUserStatus,
};
