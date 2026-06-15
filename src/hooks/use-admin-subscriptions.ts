import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPlanDistribution,
  getSubscriptionStats,
  listSubscriptions,
  updateSubscriptionBilling,
  type UpdateSubscriptionBillingRequest,
} from "../api-services/admin-subscriptions.service";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: listSubscriptions,
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
