import { delay, generateOtpCode, normalizeEmail } from "./helper";
import type { WorkspaceProfile } from "../data/workspace-profile";

/** Mock credential for local development until API is wired. */
const MOCK_CURRENT_PASSWORD = "Owner@123";
const OTP_TTL_MS = 10 * 60 * 1000;
const workspaceEmailOtpStore = new Map<string, { code: string; expiresAt: number }>();

async function sendWorkspaceEmailOtp(email: string) {
  await delay(300);
  workspaceEmailOtpStore.set(email, {
    code: generateOtpCode(),
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

async function verifyWorkspaceEmailOtp(email: string, otp: string) {
  await delay(300);
  const entry = workspaceEmailOtpStore.get(email);

  if (!entry || entry.expiresAt < Date.now()) {
    workspaceEmailOtpStore.delete(email);
    return false;
  }

  const isValid = entry.code === otp.trim();
  if (isValid) {
    workspaceEmailOtpStore.delete(email);
  }

  return isValid;
}

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

export async function initiateWorkspaceEmailChange(
  input: InitiateWorkspaceEmailChangeInput,
  currentEmail: string,
) {
  await delay(400);

  if (input.currentPassword !== MOCK_CURRENT_PASSWORD) {
    throw new Error("Current password is incorrect");
  }

  const normalizedNewEmail = normalizeEmail(input.newEmail);

  if (normalizedNewEmail === normalizeEmail(currentEmail)) {
    throw new Error("New email must be different from your current email");
  }

  await sendWorkspaceEmailOtp(normalizedNewEmail);
}

export async function completeWorkspaceEmailChange(input: CompleteWorkspaceEmailChangeInput) {
  await delay(500);

  const normalizedNewEmail = normalizeEmail(input.newEmail);
  const isValid = await verifyWorkspaceEmailOtp(normalizedNewEmail, input.otp);

  if (!isValid) {
    throw new Error("Invalid or expired OTP. Please try again.");
  }

  return normalizedNewEmail;
}

export async function sendWorkspacePasswordResetLink(email: string) {
  await delay(500);
  return normalizeEmail(email);
}
