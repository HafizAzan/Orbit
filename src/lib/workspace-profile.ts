import { confirmEmailChange, initiateEmailChange } from "../api-services/auth.service";
import { delay } from "./helper";
import type { WorkspaceProfile } from "../data/workspace-profile";
import type { AuthUser } from "../types/auth.types";

/** Mock credential for local development until password API is wired. */
const MOCK_CURRENT_PASSWORD = "Owner@123";

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
  await delay(500);
  return profile;
}

export async function changeWorkspacePassword(input: ChangeWorkspacePasswordInput): Promise<void> {
  await delay(600);

  if (input.currentPassword !== MOCK_CURRENT_PASSWORD) {
    throw new Error("Current password is incorrect");
  }

  if (input.currentPassword === input.newPassword) {
    throw new Error("New password must be different from your current password");
  }
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
  await delay(500);
  return email.trim().toLowerCase();
}
