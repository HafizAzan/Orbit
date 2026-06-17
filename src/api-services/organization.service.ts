import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  OrganizationMembersSummary,
  UpdateOrganizationMemberRoleRequest,
  UpdateWorkspaceOrganizationRequest,
  WorkspaceOrganization,
} from "../types/organization.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const getCurrentOrganization = async (): Promise<WorkspaceOrganization> => {
  const response = await ApiService.get(API_ROUTES.ORGANIZATIONS.ME, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceOrganization>(response);
};

const updateCurrentOrganization = async (
  data: UpdateWorkspaceOrganizationRequest,
): Promise<WorkspaceOrganization> => {
  const response = await ApiService.patch(API_ROUTES.ORGANIZATIONS.ME, data, AUTH_REQUEST);
  return assertApiSuccess<WorkspaceOrganization>(response);
};

const getOrganizationMembers = async (): Promise<OrganizationMembersSummary> => {
  const response = await ApiService.get(API_ROUTES.ORGANIZATIONS.MEMBERS, AUTH_REQUEST);
  return assertApiSuccess<OrganizationMembersSummary>(response);
};

const updateOrganizationMemberRole = async (
  memberId: string,
  data: UpdateOrganizationMemberRoleRequest,
): Promise<OrganizationMembersSummary["members"][number]> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ORGANIZATIONS.MEMBERS}/${memberId}`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<OrganizationMembersSummary["members"][number]>(response);
};

const removeOrganizationMember = async (memberId: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(
    `${API_ROUTES.ORGANIZATIONS.MEMBERS}/${memberId}`,
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

export {
  getCurrentOrganization,
  getOrganizationMembers,
  removeOrganizationMember,
  updateCurrentOrganization,
  updateOrganizationMemberRole,
};
