import { DEFAULT_ADMIN_PROFILE, type AdminProfile } from "../data/admin-profile";
import { delay, generateOtpCode, normalizeEmail } from "./helper";

/** Mock credential for local development until API is wired. */
const MOCK_CURRENT_PASSWORD = "Admin@123";
const OTP_TTL_MS = 10 * 60 * 1000;
const adminEmailOtpStore = new Map<string, { code: string; expiresAt: number }>();

async function sendAdminEmailOtp(email: string) {
  await delay(300);
  adminEmailOtpStore.set(email, {
    code: generateOtpCode(),
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

async function verifyAdminEmailOtp(email: string, otp: string) {
  await delay(300);
  const entry = adminEmailOtpStore.get(email);

  if (!entry || entry.expiresAt < Date.now()) {
    adminEmailOtpStore.delete(email);
    return false;
  }

  const isValid = entry.code === otp.trim();
  if (isValid) {
    adminEmailOtpStore.delete(email);
  }

  return isValid;
}

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

  await sendAdminEmailOtp(normalizedNewEmail);
}

export async function completeAdminEmailChange(input: CompleteEmailChangeInput) {
  await delay(500);

  const normalizedNewEmail = normalizeEmail(input.newEmail);
  const isValid = await verifyAdminEmailOtp(normalizedNewEmail, input.otp);

  if (!isValid) {
    throw new Error("Invalid or expired OTP. Please try again.");
  }

  return normalizedNewEmail;
}

export async function sendAdminPasswordResetLink(email: string) {
  await delay(500);
  return normalizeEmail(email);
}
