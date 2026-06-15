import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterPendingResponse,
  RegisterSendOtpRequest,
  RegisterSendOtpResponse,
  ResendRegisterOtpResponse,
  VerifyRegisterRequest,
  VerifyRegisterResponse,
} from "../types/auth.types";

const sendRegisterOtp = async (  data: RegisterSendOtpRequest,
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

const getMe = async (): Promise<AuthUser> => {
  const response = await ApiService.get(API_ROUTES.AUTH.ME);
  return assertApiSuccess<AuthUser>(response);
};

export { getMe, getRegisterPending, login, resendRegisterOtp, sendRegisterOtp, verifyRegister };
