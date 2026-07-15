import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import {
  buildPaginationSearchParams,
  normalizePaginatedResponse,
  type PaginatedResponse,
  type PaginationParams,
} from "../types/pagination.types";
import type { ContactLeadRecord, ContactLeadStatus } from "../data/admin-leads";

const AUTH_REQUEST = { requireAuth: true } as const;

export type ListAdminLeadsParams = PaginationParams & {
  status?: ContactLeadStatus;
};

const listAdminLeads = async (
  params: ListAdminLeadsParams = {},
): Promise<PaginatedResponse<ContactLeadRecord>> => {
  const searchParams = buildPaginationSearchParams(params);
  if (params.status) searchParams.set("status", params.status);
  const response = await ApiService.get(
    `${API_ROUTES.ADMIN.LEADS}?${searchParams.toString()}`,
    AUTH_REQUEST,
  );
  return normalizePaginatedResponse<ContactLeadRecord>(assertApiSuccess<unknown>(response));
};

const updateAdminLeadStatus = async (
  id: string,
  status: ContactLeadStatus,
): Promise<{ id: string; status: ContactLeadStatus }> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.LEADS}/${id}/status`,
    { status },
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ id: string; status: ContactLeadStatus }>(response);
};

export { listAdminLeads, updateAdminLeadStatus };
