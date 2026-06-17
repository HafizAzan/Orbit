import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getRegisterPending,
  login,
  logout,
  resendRegisterOtp,
  resetPassword,
  sendRegisterOtp,
  validateResetToken,
  validateInviteToken,
  acceptInvite,
  verifyRegister,
} from "../api-services/auth.service";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterPendingResponse,
  RegisterSendOtpRequest,
  RegisterSendOtpResponse,
  ResendRegisterOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ValidateResetTokenResponse,
  InviteValidationResponse,
  AcceptInviteRequest,
  AcceptInviteResponse,
  VerifyRegisterRequest,
  VerifyRegisterResponse,
} from "../types/auth.types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
}

export function useLogout() {
  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logout,
  });
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
}

export function useValidateResetToken(token: string | null) {
  return useQuery<ValidateResetTokenResponse, Error>({
    queryKey: ["reset-password-validate", token],
    queryFn: () => validateResetToken(token!),
    enabled: Boolean(token),
    retry: false,
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

export function useAcceptInvite() {
  return useMutation<AcceptInviteResponse, Error, AcceptInviteRequest>({
    mutationFn: acceptInvite,
  });
}

export function useValidateInviteToken(token: string | null) {
  return useQuery<InviteValidationResponse, Error>({
    queryKey: ["invite-validate", token],
    queryFn: () => validateInviteToken(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useVerifyRegister() {
  return useMutation<VerifyRegisterResponse, Error, VerifyRegisterRequest>({
    mutationFn: verifyRegister,
  });
}
