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
  InviteValidationResponse,
  AcceptInviteRequest,
  AcceptInviteResponse,
  ActivityHeartbeatResponse,
  ConfirmEmailChangeRequest,
  ConfirmEmailChangeResponse,
  EmailChangeRequestRecipientsResponse,
  InitiateEmailChangeRequest,
  InitiateEmailChangeResponse,
  SubmitEmailChangeRequest,
  SubmitEmailChangeRequestResponse,
  VerifyRegisterRequest,
  VerifyRegisterResponse,
} from "../types/auth.types";

const sendRegisterOtp = async (data: RegisterSendOtpRequest): Promise<RegisterSendOtpResponse> => {
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

const verifyRegister = async (data: VerifyRegisterRequest): Promise<VerifyRegisterResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.REGISTER_VERIFY, data);
  return assertApiSuccess<VerifyRegisterResponse>(response);
};

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.LOGIN, {
    email: data.email.trim().toLowerCase(),
    password: data.password,
    remember: data.remember === true,
  });
  return assertApiSuccess<LoginResponse>(response);
};

const AUTH_REQUEST = { requireAuth: true } as const;

const logout = async (): Promise<LogoutResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.LOGOUT, undefined, AUTH_REQUEST);
  return assertApiSuccess<LogoutResponse>(response);
};

const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
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

const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.RESET_PASSWORD, {
    token: data.token.trim(),
    password: data.password,
  });
  return assertApiSuccess<ResetPasswordResponse>(response);
};

const validateInviteToken = async (token: string): Promise<InviteValidationResponse> => {
  const response = await ApiService.get(API_ROUTES.AUTH.INVITE_VALIDATE, {
    params: { token: token.trim() },
  });
  return assertApiSuccess<InviteValidationResponse>(response);
};

const acceptInvite = async (data: AcceptInviteRequest): Promise<AcceptInviteResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.INVITE_ACCEPT, {
    token: data.token.trim(),
    password: data.password,
    fullName: data.fullName?.trim() || undefined,
  });
  return assertApiSuccess<AcceptInviteResponse>(response);
};

const getMe = async (): Promise<AuthUser> => {
  const response = await ApiService.get(API_ROUTES.AUTH.ME, AUTH_REQUEST);
  return assertApiSuccess<AuthUser>(response);
};

const recordActivityHeartbeat = async (): Promise<ActivityHeartbeatResponse> => {
  const response = await ApiService.post(API_ROUTES.AUTH.HEARTBEAT, undefined, AUTH_REQUEST);
  return assertApiSuccess<ActivityHeartbeatResponse>(response);
};

const initiateEmailChange = async (
  data: InitiateEmailChangeRequest,
): Promise<InitiateEmailChangeResponse> => {
  const response = await ApiService.post(
    API_ROUTES.AUTH.EMAIL_INITIATE,
    {
      newEmail: data.newEmail.trim().toLowerCase(),
      currentPassword: data.currentPassword,
    },
    AUTH_REQUEST,
  );
  return assertApiSuccess<InitiateEmailChangeResponse>(response);
};

const confirmEmailChange = async (
  data: ConfirmEmailChangeRequest,
): Promise<ConfirmEmailChangeResponse> => {
  const response = await ApiService.post(
    API_ROUTES.AUTH.EMAIL_CONFIRM,
    {
      newEmail: data.newEmail.trim().toLowerCase(),
      otp: data.otp.trim(),
    },
    AUTH_REQUEST,
  );
  return assertApiSuccess<ConfirmEmailChangeResponse>(response);
};

const getEmailChangeRequestRecipients = async (): Promise<EmailChangeRequestRecipientsResponse> => {
  const response = await ApiService.get(API_ROUTES.AUTH.EMAIL_REQUEST_RECIPIENTS, AUTH_REQUEST);
  return assertApiSuccess<EmailChangeRequestRecipientsResponse>(response);
};

const submitEmailChangeRequest = async (
  data: SubmitEmailChangeRequest,
): Promise<SubmitEmailChangeRequestResponse> => {
  const response = await ApiService.post(
    API_ROUTES.AUTH.EMAIL_REQUEST,
    {
      subject: data.subject.trim(),
      newEmail: data.newEmail.trim().toLowerCase(),
      currentEmail: data.currentEmail.trim().toLowerCase(),
      reason: data.reason.trim(),
      recipientIds: data.recipientIds,
    },
    AUTH_REQUEST,
  );
  return assertApiSuccess<SubmitEmailChangeRequestResponse>(response);
};

export {
  confirmEmailChange,
  forgotPassword,
  getEmailChangeRequestRecipients,
  getMe,
  initiateEmailChange,
  recordActivityHeartbeat,
  getRegisterPending,
  login,
  logout,
  resendRegisterOtp,
  resetPassword,
  sendRegisterOtp,
  validateResetToken,
  acceptInvite,
  validateInviteToken,
  verifyRegister,
  submitEmailChangeRequest,
};
