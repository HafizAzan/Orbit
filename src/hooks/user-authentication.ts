import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRegisterPending,
  login,
  resendRegisterOtp,
  sendRegisterOtp,
  verifyRegister,
} from "../api-services/auth.service";
import type {
  LoginRequest,
  LoginResponse,
  RegisterPendingResponse,
  RegisterSendOtpRequest,
  RegisterSendOtpResponse,
  ResendRegisterOtpResponse,
  VerifyRegisterRequest,
  VerifyRegisterResponse,
} from "../types/auth.types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
}

export function useSendRegisterOtp() {
  return useMutation<RegisterSendOtpResponse, Error, RegisterSendOtpRequest>({
    mutationFn: sendRegisterOtp,
  });
}

export function useRegisterPending(email: string | null, enabled = true) {
  return useQuery<RegisterPendingResponse, Error>({
    queryKey: ["register-pending", email],
    queryFn: () => getRegisterPending(email!),
    enabled: Boolean(email) && enabled,
    retry: false,
    staleTime: 30_000,
  });
}

export function useResendRegisterOtp() {
  return useMutation<ResendRegisterOtpResponse, Error, string>({
    mutationFn: resendRegisterOtp,
  });
}

export function useVerifyRegister() {
  return useMutation<VerifyRegisterResponse, Error, VerifyRegisterRequest>({
    mutationFn: verifyRegister,
  });
}
