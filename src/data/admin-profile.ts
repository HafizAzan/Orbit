export type PlatformAdminRole = "platform_admin";

export type AdminProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: PlatformAdminRole;
  emailVerified: boolean;
};

export const PLATFORM_ADMIN_ROLE_LABEL = "Super Admin";

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  id: "platform-admin-1",
  firstName: "Admin",
  lastName: "User",
  email: "admin@Orbit.io",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  role: "platform_admin",
  emailVerified: true,
};

export const PROFILE_PASSWORD_HINTS = [
  "At least 8 characters",
  "One uppercase and one lowercase letter",
  "One number and one special character",
  "Must differ from your current password",
] as const;

export const PROFILE_EMAIL_SECURITY_NOTE =
  "Your login email is protected. Changing it requires password verification and OTP confirmation on the new address.";

export const EMAIL_CHANGE_STEPS = [
  "Verify your identity with your current password",
  "Enter the new email address you want to use",
  "Enter the 6-digit OTP sent to the new email",
  "Your email is updated and the previous address is notified",
] as const;

export const FORGOT_PASSWORD_FLOW_STEPS = [
  "Click “Send reset link” below",
  "We email a secure link to your registered address",
  "Open the link and set a new password",
  "Return here and sign in with the new password",
] as const;

export const FORGOT_PASSWORD_NOTE =
  "If you forgot your current password, use a reset link on your registered email instead of guessing.";
