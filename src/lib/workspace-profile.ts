import {
  changePassword,
  confirmEmailChange,
  forgotPassword,
  initiateEmailChange,
  updateProfile,
} from "../api-services/auth.service";
import {
  buildWorkspaceProfileFromUser,
  getWorkspaceProfileDisplayName,
  type WorkspaceProfile,
} from "../data/workspace-profile";
import type { AuthUser } from "../types/auth.types";

export type ChangeWorkspacePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type InitiateWorkspaceEmailChangeInput = {
  newEmail: string;
  currentPassword: string;
};

export type CompleteWorkspaceEmailChangeInput = {
  newEmail: string;
  otp: string;
};

export type CompleteWorkspaceEmailChangeResult = {
  email: string;
  user: AuthUser;
};

export async function updateWorkspaceProfile(profile: WorkspaceProfile): Promise<WorkspaceProfile> {
  const fullName = getWorkspaceProfileDisplayName(profile);
  const user = await updateProfile({ fullName });
  return buildWorkspaceProfileFromUser(user);
}

export async function changeWorkspacePassword(input: ChangeWorkspacePasswordInput): Promise<void> {
  await changePassword({
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
  });
}

export async function initiateWorkspaceEmailChange(input: InitiateWorkspaceEmailChangeInput) {
  await initiateEmailChange({
    newEmail: input.newEmail,
    currentPassword: input.currentPassword,
  });
}

export async function completeWorkspaceEmailChange(
  input: CompleteWorkspaceEmailChangeInput,
): Promise<CompleteWorkspaceEmailChangeResult> {
  const result = await confirmEmailChange({
    newEmail: input.newEmail,
    otp: input.otp,
  });

  return {
    email: result.email,
    user: result.user,
  };
}

export async function sendWorkspacePasswordResetLink(email: string) {
  const result = await forgotPassword({ email });
  return result.email;
}
