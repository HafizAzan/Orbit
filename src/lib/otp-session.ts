import type { AuthFlow } from "../types/auth.types";

const OTP_SESSION_PREFIX = "orbit:otp-session";

export type OtpSession = {
  email: string;
  flow: AuthFlow;
  expiresAt: string;
};

function getStorageKey(email: string) {
  return `${OTP_SESSION_PREFIX}:${email.trim().toLowerCase()}`;
}

export function saveOtpSession(session: OtpSession) {
  const normalizedEmail = session.email.trim().toLowerCase();
  sessionStorage.setItem(getStorageKey(normalizedEmail), JSON.stringify({ ...session, email: normalizedEmail }));
}

export function getOtpSession(email: string): OtpSession | null {
  const raw = sessionStorage.getItem(getStorageKey(email));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OtpSession;
  } catch {
    return null;
  }
}

export function clearOtpSession(email: string) {
  sessionStorage.removeItem(getStorageKey(email));
}

export function getRemainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
