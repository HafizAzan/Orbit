import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disableTwoFactor,
  enableTwoFactor,
  getTwoFactorStatus,
  setupTwoFactor,
  verifyTwoFactor,
} from "../api-services/auth.service";

export function useTwoFactorStatus() {
  return useQuery({
    queryKey: ["two-factor-status"],
    queryFn: getTwoFactorStatus,
    staleTime: 30_000,
  });
}

export function useSetupTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setupTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["two-factor-status"] });
    },
  });
}

export function useEnableTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["two-factor-status"] });
    },
  });
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["two-factor-status"] });
    },
  });
}

export function useVerifyTwoFactor() {
  return useMutation({
    mutationFn: verifyTwoFactor,
  });
}
