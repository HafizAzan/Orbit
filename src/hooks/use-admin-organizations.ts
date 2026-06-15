import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationStats,
  listOrganizations,
  updateOrganization,
  type CreateOrganizationRequest,
  type UpdateOrganizationRequest,
} from "../api-services/admin-organizations.service";

export function useOrganizations() {
  return useQuery({
    queryKey: ["admin-organizations"],
    queryFn: listOrganizations,
  });
}

export function useOrganizationStats() {
  return useQuery({
    queryKey: ["admin-organizations-stats"],
    queryFn: getOrganizationStats,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) => createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-plan-distribution"] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationRequest }) =>
      updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-plan-distribution"] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-plan-distribution"] });
    },
  });
}
