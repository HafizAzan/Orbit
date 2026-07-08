import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmOrganizationTwoFactor,
  disableOrganizationTwoFactor,
  getOrganizationTwoFactorStatus,
  setupOrganizationTwoFactor,
} from "../api-services/organization.service";

export function useOrganizationTwoFactorStatus() {
  return useQuery({
    queryKey: ["organization-two-factor-status"],
    queryFn: getOrganizationTwoFactorStatus,
    staleTime: 30_000,
  });
}

export function useSetupOrganizationTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setupOrganizationTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-two-factor-status"] });
    },
  });
}

export function useConfirmOrganizationTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmOrganizationTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-two-factor-status"] });
    },
  });
}

export function useDisableOrganizationTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableOrganizationTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-two-factor-status"] });
    },
  });
}
