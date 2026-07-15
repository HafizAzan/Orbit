import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listAdminLeads,
  updateAdminLeadStatus,
  type ListAdminLeadsParams,
} from "../api-services/admin-leads.service";
import type { ContactLeadStatus } from "../data/admin-leads";

export function useAdminLeads(params: ListAdminLeadsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  return useQuery({
    queryKey: ["admin-leads", page, limit, params.status ?? ""],
    queryFn: () => listAdminLeads({ ...params, page, limit }),
  });
}

export function useUpdateAdminLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactLeadStatus }) =>
      updateAdminLeadStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
  });
}
