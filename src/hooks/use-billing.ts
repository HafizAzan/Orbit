import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelPlan,
  changePlan,
  confirmCheckout,
  createCheckout,
  getCatalog,
  getCurrentSubscription,
  getOrganizationUsage,
  listInvoices,
  refundPayment,
  selectPlan,
  createPortalSession,
} from "../api-services/billing.service";
import { useAppContext } from "../context/app-context";
import { canManageBilling } from "../lib/auth-routing";
import type {
  CancelPlanRequest,
  ChangePlanRequest,
  ConfirmCheckoutRequest,
  CreateCheckoutRequest,
  RefundPaymentRequest,
} from "../types/billing.types";

function useBillingAccess() {
  const app = useAppContext();
  const user = app?.user ?? null;

  return {
    isAuthenticated: Boolean(app?.isAuthenticated && user),
    canManage: user ? canManageBilling(user) : false,
  };
}

export function useBillingCatalog() {
  return useQuery({
    queryKey: ["billing-catalog"],
    queryFn: getCatalog,
    staleTime: 60_000,
  });
}

export function useCurrentSubscription() {
  const { isAuthenticated, canManage } = useBillingAccess();

  return useQuery({
    queryKey: ["billing-subscription"],
    queryFn: getCurrentSubscription,
    enabled: isAuthenticated && canManage,
    staleTime: 30_000,
  });
}

export function useOrganizationUsage() {
  const { isAuthenticated } = useBillingAccess();

  return useQuery({
    queryKey: ["billing-usage"],
    queryFn: getOrganizationUsage,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function useBillingInvoices() {
  const { isAuthenticated, canManage } = useBillingAccess();

  return useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => listInvoices(),
    enabled: isAuthenticated && canManage,
    staleTime: 30_000,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (data: CreateCheckoutRequest) => createCheckout(data),
  });
}

export function useConfirmCheckout() {
  return useMutation({
    mutationFn: (data: ConfirmCheckoutRequest) => confirmCheckout(data),
  });
}

export function useSelectPlan() {
  return useMutation({
    mutationFn: (data: CreateCheckoutRequest) => selectPlan(data),
  });
}

export function useCancelPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelPlanRequest = {}) => cancelPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing-usage"] });
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
    },
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePlanRequest) => changePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing-usage"] });
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RefundPaymentRequest = {}) => refundPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-subscription"] });
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: (returnUrl?: string) => createPortalSession(returnUrl),
  });
}
