import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  OrganizationAbout,
  OrganizationMembersSummary,
  OrganizationTwoFactorSetupResponse,
  OrganizationTwoFactorStatusResponse,
  UpdateOrganizationMemberEmailRequest,
  UpdateOrganizationMemberRoleRequest,
  UpdateWorkspaceOrganizationRequest,
  WorkspaceOrganization,
} from "../types/organization.types";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const getCurrentOrganization = async (): Promise<WorkspaceOrganization> => {
  const response = await ApiService.get(API_ROUTES.ORGANIZATIONS.ME, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceOrganization>(response);
};

const getOrganizationAbout = async (): Promise<OrganizationAbout> => {
  const response = await ApiService.get(API_ROUTES.ORGANIZATIONS.ABOUT, AUTH_REQUEST);
  return assertApiSuccess<OrganizationAbout>(response);
};

const updateCurrentOrganization = async (
  data: UpdateWorkspaceOrganizationRequest,
): Promise<WorkspaceOrganization> => {
  const response = await ApiService.patch(API_ROUTES.ORGANIZATIONS.ME, data, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceOrganization>(response);
};

const getOrganizationMembers = async (
  params: PaginationParams = {},
): Promise<OrganizationMembersSummary> => {
  const searchParams = buildPaginationSearchParams(params);
  const response = await ApiService.get(
    `${API_ROUTES.ORGANIZATIONS.MEMBERS}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  const payload = assertApiSuccess<OrganizationMembersSummary & { members?: OrganizationMembersSummary["data"] }>(
    response,
  );
  const normalized = normalizePaginatedResponse<OrganizationMembersSummary["data"][number]>(payload);

  return {
    occupiedSeats: payload.occupiedSeats,
    totalSeats: payload.totalSeats,
    data: normalized.data.length > 0 ? normalized.data : payload.members ?? [],
    page: normalized.page,
    limit: normalized.limit,
    total: normalized.total,
  };
};

const updateOrganizationMemberRole = async (
  memberId: string,
  data: UpdateOrganizationMemberRoleRequest,
): Promise<OrganizationMembersSummary["data"][number]> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ORGANIZATIONS.MEMBERS}/${memberId}`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<OrganizationMembersSummary["data"][number]>(response);
};

const updateOrganizationMemberEmail = async (
  memberId: string,
  data: UpdateOrganizationMemberEmailRequest,
): Promise<OrganizationMembersSummary["data"][number]> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ORGANIZATIONS.MEMBERS}/${memberId}/email`,
    { email: data.email.trim().toLowerCase() },
    AUTH_REQUEST,
  );
  return assertApiSuccess<OrganizationMembersSummary["data"][number]>(response);
};

const removeOrganizationMember = async (memberId: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.ORGANIZATIONS.MEMBERS}/${memberId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

const getOrganizationTwoFactorStatus = async (): Promise<OrganizationTwoFactorStatusResponse> => {
  const response = await ApiService.get(API_ROUTES.ORGANIZATIONS.TWO_FACTOR_STATUS, AUTH_REQUEST);
  return assertApiSuccess<OrganizationTwoFactorStatusResponse>(response);
};

const setupOrganizationTwoFactor = async (): Promise<OrganizationTwoFactorSetupResponse> => {
  const response = await ApiService.post(API_ROUTES.ORGANIZATIONS.TWO_FACTOR_SETUP, undefined, AUTH_REQUEST);
  return assertApiSuccess<OrganizationTwoFactorSetupResponse>(response);
};

const confirmOrganizationTwoFactor = async (code: string) => {
  const response = await ApiService.post(
    API_ROUTES.ORGANIZATIONS.TWO_FACTOR_CONFIRM,
    { code },
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string; configured: boolean }>(response);
};

export {
  confirmOrganizationTwoFactor,
  getCurrentOrganization,
  getOrganizationAbout,
  getOrganizationMembers,
  getOrganizationTwoFactorStatus,
  removeOrganizationMember,
  setupOrganizationTwoFactor,
  updateCurrentOrganization,
  updateOrganizationMemberEmail,
  updateOrganizationMemberRole,
};
