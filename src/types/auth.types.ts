export type AuthProvider = "email" | "google" | "github";
export type SignupSource = "direct" | "invite";
export type RegisterAs = "super_admin" | "owner" | "admin" | "manager" | "member";
export type EmailVerificationStatus = "pending" | "verified";
export type AccountStatus = "pending" | "active" | "suspended";
export type AuthFlow = "login" | "register";

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
  email: string;
};

export type ValidateResetTokenResponse = {
  email: string;
  expiresAt: string;
  isValid: boolean;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type LogoutResponse = {
  message: string;
};

export type InitiateEmailChangeRequest = {
  newEmail: string;
  currentPassword: string;
};

export type InitiateEmailChangeResponse = {
  message: string;
  email: string;
  expiresAt: string;
};

export type ConfirmEmailChangeRequest = {
  newEmail: string;
  otp: string;
};

export type ConfirmEmailChangeResponse = {
  message: string;
  email: string;
  user: AuthUser;
};

export type EmailChangeRequestRecipient = {
  id: string;
  fullName: string;
  email: string;
  role: RegisterAs;
};

export type EmailChangeRequestRecipientsResponse = {
  data: EmailChangeRequestRecipient[];
};

export type SubmitEmailChangeRequest = {
  subject: string;
  newEmail: string;
  currentEmail: string;
  reason: string;
  recipientIds: string[];
};

export type SubmitEmailChangeRequestResponse = {
  message: string;
  recipientCount: number;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  remember?: boolean;
};

export type LoginResponse = AuthSessionResponse | AuthTwoFactorChallengeResponse;

export function isTwoFactorChallengeResponse(response: LoginResponse): response is AuthTwoFactorChallengeResponse {
  return "requiresTwoFactor" in response && response.requiresTwoFactor === true;
}

export type VerifyTwoFactorRequest = {
  challengeToken: string;
  code: string;
};

export type TwoFactorSetupResponse = {
  secret: string;
  otpauthUrl: string;
};

export type TwoFactorStatusResponse = {
  enabled: boolean;
  requiredByWorkspace: boolean;
  pendingSetup: boolean;
};

export type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterSendOtpRequest = {
  fullName: string;
  organizationName: string;
  organizationSlug: string;
  email: string;
  password: string;
  authProvider: AuthProvider;
  signupSource: SignupSource;
  kindOfUser: RegisterAs;
  inviteToken?: string;
};

export type VerifyRegisterRequest = {
  email: string;
  otp: string;
};

export type RegisterSendOtpResponse = {
  message: string;
  email: string;
  expiresAt: string;
};

export type RegisterPendingResponse = {
  email: string;
  expiresAt: string;
  isExpired: boolean;
};

export type ResendRegisterOtpResponse = {
  message: string;
  email: string;
  expiresAt: string;
};

export type AuthOrganization = {
  id: string;
  name: string;
};

import type { AppUiThemeId } from "../data/app-ui-themes";

export type { AppUiThemeId };

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: RegisterAs;
  isPlatformAdmin: boolean;
  emailVerificationStatus: EmailVerificationStatus;
  accountStatus: AccountStatus;
  organization: AuthOrganization | null;
  requiresPlanSelection: boolean;
  organizationAwaitingSubscription: boolean;
  uiTheme?: AppUiThemeId;
  twoFactorEnabled?: boolean;
  avatarUrl?: string | null;
};

export type AuthTwoFactorChallengeResponse = {
  message: string;
  requiresTwoFactor: true;
  challengeToken: string;
};

export type AuthSessionResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type AuthRefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type VerifyRegisterResponse = AuthSessionResponse | AuthTwoFactorChallengeResponse;

export type InviteValidationResponse = {
  isValid: true;
  email: string;
  fullName: string;
  role: RegisterAs;
  roleLabel: string;
  department: string;
  departmentLabel: string;
  organizationName: string;
  organizationSlug: string;
  inviterName: string;
  expiresAt: string;
};

export type AcceptInviteRequest = {
  token: string;
  password: string;
  fullName?: string;
};

export type AcceptInviteResponse = AuthSessionResponse | AuthTwoFactorChallengeResponse;

export type AcceptInviteFormValues = {
  fullName: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFormValues = {
  fullName: string;
  organizationName: string;
  organizationSlug: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TwoFactorChallengeLocationState = {
  challengeToken: string;
  remember?: boolean;
};

export type VerifyOtpLocationState = {
  email: string;
  flow: AuthFlow;
  expiresAt?: string;
};

export type RegisterSendOtpDefaults = Pick<RegisterSendOtpRequest, "authProvider" | "signupSource" | "kindOfUser">;
