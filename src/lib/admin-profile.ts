import { DEFAULT_ADMIN_PROFILE, type AdminProfile } from "../data/admin-profile";
import { sendOtp, verifyOtp } from "./auth";
import { delay, normalizeEmail } from "./helper";

/** Mock credential for local development until API is wired. */
const MOCK_CURRENT_PASSWORD = "Admin@123";

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

export async function updateAdminProfile(profile: AdminProfile): Promise<AdminProfile> {
  await delay(500);
  return profile;
}

export async function changeAdminPassword(input: ChangeAdminPasswordInput): Promise<void> {
  await delay(600);

  if (input.currentPassword !== MOCK_CURRENT_PASSWORD) {
    throw new Error("Current password is incorrect");
  }

  if (input.currentPassword === input.newPassword) {
    throw new Error("New password must be different from your current password");
  }
}

export function getAdminDisplayName(profile: AdminProfile = DEFAULT_ADMIN_PROFILE) {
  return `${profile.firstName} ${profile.lastName}`.trim();
}

export async function initiateAdminEmailChange(input: InitiateEmailChangeInput, currentEmail: string) {
  await delay(400);

  if (input.currentPassword !== MOCK_CURRENT_PASSWORD) {
    throw new Error("Current password is incorrect");
  }

  const normalizedNewEmail = normalizeEmail(input.newEmail);

  if (normalizedNewEmail === normalizeEmail(currentEmail)) {
    throw new Error("New email must be different from your current email");
  }

  await sendOtp(normalizedNewEmail);
}

export async function completeAdminEmailChange(input: CompleteEmailChangeInput) {
  await delay(500);

  const normalizedNewEmail = normalizeEmail(input.newEmail);
  const isValid = await verifyOtp(normalizedNewEmail, input.otp);

  if (!isValid) {
    throw new Error("Invalid or expired OTP. Please try again.");
  }

  return normalizedNewEmail;
}

export async function sendAdminPasswordResetLink(email: string) {
  await delay(500);
  return normalizeEmail(email);
}
