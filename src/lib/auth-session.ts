import type { AuthUser } from "../types/auth.types";
import {
  clearAccessToken,
  clearRefreshToken,
  readAccessTokenFromCookie,
  readRefreshTokenFromCookie,
  setAccessToken,
  setRefreshToken,
} from "./cookies";

const USER_SESSION_KEY = "orbit:user";
const SESSION_EXPIRES_KEY = "orbit:session_expires";
const REMEMBER_ME_KEY = "orbit:remember_me";

export const AUTH_SESSION_TTL_MS = {
  remember: 30 * 24 * 60 * 60 * 1000,
  session: 30 * 60 * 1000,
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

export function saveAuthSession(
  accessToken: string,
  user: AuthUser,
  remember = false,
  refreshToken?: string,
) {
  setAccessToken(accessToken, remember);
  if (refreshToken) {
    setRefreshToken(refreshToken, remember);
  }
  saveStoredUser(user, remember);
  saveSessionExpiry(getSessionExpiresAt(remember));
}

export function updateAuthTokens(accessToken: string, refreshToken: string, remember = isRememberMeEnabled()) {
  setAccessToken(accessToken, remember);
  setRefreshToken(refreshToken, remember);
  saveSessionExpiry(getSessionExpiresAt(remember));
}

export function clearAuthSession() {
  clearAccessToken();
  clearRefreshToken();
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

export function getRefreshToken(): string | null {
  if (isAuthSessionExpired()) {
    clearAuthSession();
    return null;
  }

  return readRefreshTokenFromCookie();
}
