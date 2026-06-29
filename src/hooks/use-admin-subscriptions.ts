import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPlanDistribution,
  getSubscriptionStats,
  listSubscriptionsPage,
  updateSubscriptionBilling,
  type UpdateSubscriptionBillingRequest,
} from "../api-services/admin-subscriptions.service";
import type { PaginationParams } from "../types/pagination.types";

export function useSubscriptions(params: PaginationParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 25;

  return useQuery({
    queryKey: ["admin-subscriptions", page, limit],
    queryFn: () => listSubscriptionsPage({ page, limit }),
  });
}
export function useSubscriptionStats() {
  return useQuery({
    queryKey: ["admin-subscriptions-stats"],
    queryFn: getSubscriptionStats,
  });
}

export function usePlanDistribution() {
  return useQuery({
    queryKey: ["admin-subscriptions-plan-distribution"],
    queryFn: getPlanDistribution,
  });
}

export function useUpdateSubscriptionBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionBillingRequest }) =>
      updateSubscriptionBilling(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions-plan-distribution"] });
    },
  });
}
