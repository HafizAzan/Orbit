import {
  changePassword,
  confirmEmailChange,
  forgotPassword,
  initiateEmailChange,
  updateProfile,
} from "../api-services/auth.service";
import {
  DEFAULT_ADMIN_PROFILE,
  type AdminProfile,
} from "../data/admin-profile";
import { splitFullName } from "../data/workspace-profile";
import { resolveTaskAttachmentUrl } from "./task-attachments";
import type { AuthUser } from "../types/auth.types";

export type ChangeAdminPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type InitiateEmailChangeInput = {
  newEmail: string;
  currentPassword: string;
};

export type CompleteEmailChangeInput = {
  newEmail: string;
  otp: string;
};

export type CompleteAdminEmailChangeResult = {
  email: string;
  user: AuthUser;
};

export function buildAdminProfileFromUser(user: AuthUser): AdminProfile {
  const { firstName, lastName } = splitFullName(user.name);

  return {
    id: user.id,
    firstName,
    lastName,
    email: user.email,
    avatarUrl: user.avatarUrl
      ? resolveTaskAttachmentUrl(user.avatarUrl)
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
    role: "platform_admin",
    emailVerified: user.emailVerificationStatus === "verified",
  };
}

export function getAdminDisplayName(profile: AdminProfile = DEFAULT_ADMIN_PROFILE) {
  return `${profile.firstName} ${profile.lastName}`.trim();
}

export async function updateAdminProfile(profile: AdminProfile): Promise<AdminProfile> {
  const fullName = getAdminDisplayName(profile);
  const user = await updateProfile({ fullName });
  return buildAdminProfileFromUser(user);
}

export async function changeAdminPassword(input: ChangeAdminPasswordInput): Promise<void> {
  await changePassword({
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
  });
}

export async function initiateAdminEmailChange(input: InitiateEmailChangeInput) {
  await initiateEmailChange({
    newEmail: input.newEmail,
    currentPassword: input.currentPassword,
  });
}

export async function completeAdminEmailChange(
  input: CompleteEmailChangeInput,
): Promise<CompleteAdminEmailChangeResult> {
  const result = await confirmEmailChange({
    newEmail: input.newEmail,
    otp: input.otp,
  });

  return {
    email: result.email,
    user: result.user,
  };
}

export async function sendAdminPasswordResetLink(email: string) {
  const result = await forgotPassword({ email });
  return result.email;
}
