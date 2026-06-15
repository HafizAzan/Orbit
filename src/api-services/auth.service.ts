import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  AuthUser,
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
  VerifyRegisterRequest,
  VerifyRegisterResponse,
} from "../types/auth.types";

const sendRegisterOtp = async (
  data: RegisterSendOtpRequest,
): Promise<RegisterSendOtpResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.REGISTER_SEND_OTP, data);
  return assertApiSuccess<RegisterSendOtpResponse>(response);
};

const getRegisterPending = async (email: string): Promise<RegisterPendingResponse> => {
  const response = await ApiService.get(API_ROUTES.AUTH.REGISTER_PENDING, {
    params: { email: email.trim().toLowerCase() },
  });
  return assertApiSuccess<RegisterPendingResponse>(response);
};

const resendRegisterOtp = async (email: string): Promise<ResendRegisterOtpResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.REGISTER_RESEND_OTP, {
    email: email.trim().toLowerCase(),
  });
  return assertApiSuccess<ResendRegisterOtpResponse>(response);
};

const verifyRegister = async (
  data: VerifyRegisterRequest,
): Promise<VerifyRegisterResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.REGISTER_VERIFY, data);
  return assertApiSuccess<VerifyRegisterResponse>(response);
};

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.LOGIN, {
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });
  return assertApiSuccess<LoginResponse>(response);
};

const AUTH_REQUEST = { requireAuth: true } as const;

const logout = async (): Promise<LogoutResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.LOGOUT, undefined, AUTH_REQUEST);
  return assertApiSuccess<LogoutResponse>(response);
};

const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.FORGOT_PASSWORD, {
    email: data.email.trim().toLowerCase(),
  });
  return assertApiSuccess<ForgotPasswordResponse>(response);
};

const validateResetToken = async (token: string): Promise<ValidateResetTokenResponse> => {
  const response = await ApiService.get(API_ROUTES.AUTH.RESET_PASSWORD_VALIDATE, {
    params: { token: token.trim() },
  });
  return assertApiSuccess<ValidateResetTokenResponse>(response);
};

const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.RESET_PASSWORD, {
    token: data.token.trim(),
    password: data.password,
  });
  return assertApiSuccess<ResetPasswordResponse>(response);
};

const getMe = async (): Promise<AuthUser> => {
  const response = await ApiService.get(API_ROUTES.AUTH.ME, AUTH_REQUEST);
  return assertApiSuccess<AuthUser>(response);
};

export {
  forgotPassword,
  getMe,
  getRegisterPending,
  login,
  logout,
  resendRegisterOtp,
  resetPassword,
  sendRegisterOtp,
  validateResetToken,
  verifyRegister,
};
