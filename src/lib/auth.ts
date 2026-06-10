import { delay, generateOtpCode, normalizeEmail, normalizeText } from "./helper";

export type UserRole = "owner" | "admin" | "member";

export type Organization = {
  id: string;
  name: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: Organization;
};

export type RegisterAccountInput = {
  fullName: string;
  organizationName: string;
  email: string;
  password: string;
};

export type AuthFlow = "login" | "register";

type OtpEntry = {
  code: string;
  expiresAt: number;
};

const OTP_TTL_MS = 10 * 60 * 1000;
const otpStore = new Map<string, OtpEntry>();

export async function sendOtp(email: string): Promise<string> {
  await delay(300);

  const normalizedEmail = normalizeEmail(email);
  const code = generateOtpCode();
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  return code;
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  await delay(300);

  const normalizedEmail = normalizeEmail(email);
  const entry = otpStore.get(normalizedEmail);

  if (!entry || entry.expiresAt < Date.now()) {
    otpStore.delete(normalizedEmail);
    return false;
  }

  const isValid = entry.code === otp.trim();
  if (isValid) {
    otpStore.delete(normalizedEmail);
  }

  return isValid;
}

export async function loginAccount(email: string): Promise<AuthUser> {
  await delay(400);

  const normalizedEmail = normalizeEmail(email);

  return {
    id: crypto.randomUUID(),
    name: normalizedEmail.split("@")[0] ?? "User",
    email: normalizedEmail,
    role: "member",
    organization: {
      id: crypto.randomUUID(),
      name: "My Organization",
    },
  };
}

export async function registerAccount(input: RegisterAccountInput): Promise<AuthUser> {
  await delay(400);

  const organization: Organization = {
    id: crypto.randomUUID(),
    name: normalizeText(input.organizationName),
  };

  return {
    id: crypto.randomUUID(),
    name: normalizeText(input.fullName),
    email: normalizeEmail(input.email),
    role: "owner",
    organization,
  };
}
