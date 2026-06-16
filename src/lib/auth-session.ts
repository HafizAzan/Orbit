import type { AuthUser } from "../types/auth.types";
import { clearAccessToken, readAccessTokenFromCookie, setAccessToken } from "./cookies";

const USER_SESSION_KEY = "flow-sync:user";
const SESSION_EXPIRES_KEY = "flow-sync:session_expires";
const REMEMBER_ME_KEY = "flow-sync:remember_me";

export const AUTH_SESSION_TTL_MS = {
  remember: 15 * 24 * 60 * 60 * 1000,
  session: 8 * 60 * 60 * 1000,
} as const;

function saveSessionExpiry(expiresAt: number) {
  localStorage.setItem(SESSION_EXPIRES_KEY, String(expiresAt));
}

export function getSessionExpiresAt(remember: boolean) {
  return Date.now() + (remember ? AUTH_SESSION_TTL_MS.remember : AUTH_SESSION_TTL_MS.session);
}

export function isRememberMeEnabled() {
  return localStorage.getItem(REMEMBER_ME_KEY) === "1";
}

export function isAuthSessionExpired() {
  const raw = localStorage.getItem(SESSION_EXPIRES_KEY);
  if (!raw) return false;

  const expiresAt = Number(raw);
  if (!Number.isFinite(expiresAt)) return false;

  return Date.now() >= expiresAt;
}

export function saveStoredUser(user: AuthUser, remember = isRememberMeEnabled()) {
  if (remember) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    sessionStorage.removeItem(USER_SESSION_KEY);
    localStorage.setItem(REMEMBER_ME_KEY, "1");
    return;
  }

  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  localStorage.removeItem(USER_SESSION_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (isAuthSessionExpired()) {
    clearAuthSession();
    return null;
  }

  const raw = localStorage.getItem(USER_SESSION_KEY) ?? sessionStorage.getItem(USER_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  sessionStorage.removeItem(USER_SESSION_KEY);
  localStorage.removeItem(USER_SESSION_KEY);
}

export function saveAuthSession(accessToken: string, user: AuthUser, remember = false) {
  setAccessToken(accessToken, remember);
  saveStoredUser(user, remember);
  saveSessionExpiry(getSessionExpiresAt(remember));
}

export function clearAuthSession() {
  clearAccessToken();
  clearStoredUser();
  localStorage.removeItem(SESSION_EXPIRES_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
}

export function hasAuthSession() {
  return Boolean(getAccessToken() && getStoredUser());
}

export function getAccessToken(): string | null {
  if (isAuthSessionExpired()) {
    clearAuthSession();
    return null;
  }

  return readAccessTokenFromCookie();
}
