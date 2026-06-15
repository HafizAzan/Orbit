import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  OrganizationPlan,
  OrganizationRecord,
  OrganizationStatus,
} from "../data/admin-organizations";

export type OrganizationStats = {
  total: number;
  active: number;
  trial: number;
  suspended: number;
};

export type CreateOrganizationRequest = {
  name: string;
  slug?: string;
  ownerName: string;
  ownerEmail: string;
  plan: OrganizationPlan;
  status: OrganizationStatus;
};

export type UpdateOrganizationRequest = {
  name?: string;
  slug?: string;
  status?: OrganizationStatus;
  billingEmail?: string;
  plan?: OrganizationPlan;
  projectCount?: number;
};

const AUTH_REQUEST = { requireAuth: true } as const;

const listOrganizations = async (): Promise<OrganizationRecord[]> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.ORGANIZATIONS, AUTH_REQUEST);
  return assertApiSuccess<OrganizationRecord[]>(response);
};

const getOrganizationStats = async (): Promise<OrganizationStats> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.ORGANIZATION_STATS, AUTH_REQUEST);
  return assertApiSuccess<OrganizationStats>(response);
};

const createOrganization = async (
  data: CreateOrganizationRequest,
): Promise<OrganizationRecord> => {
  const response = await ApiService.post(API_ROUTES.ADMIN.ORGANIZATIONS, data, AUTH_REQUEST);
  return assertApiSuccess<OrganizationRecord>(response);
};

const updateOrganization = async (
  id: string,
  data: UpdateOrganizationRequest,
): Promise<OrganizationRecord> => {
  const response = await ApiService.patch(`${API_ROUTES.ADMIN.ORGANIZATIONS}/${id}`, data, AUTH_REQUEST);
  return assertApiSuccess<OrganizationRecord>(response);
};

const deleteOrganization = async (id: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(`${API_ROUTES.ADMIN.ORGANIZATIONS}/${id}`, AUTH_REQUEST);
  return assertApiSuccess<{ message: string }>(response);
};

export {
  createOrganization,
  deleteOrganization,
  getOrganizationStats,
  listOrganizations,
  updateOrganization,
};
