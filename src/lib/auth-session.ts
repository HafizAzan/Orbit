import type { AuthUser } from "../types/auth.types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./cookies";

const USER_SESSION_KEY = "flow-sync:user";

export function saveStoredUser(user: AuthUser) {
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  sessionStorage.removeItem(USER_SESSION_KEY);
}

export function saveAuthSession(accessToken: string, user: AuthUser) {
  setAccessToken(accessToken);
  saveStoredUser(user);
}

export function clearAuthSession() {
  clearAccessToken();
  clearStoredUser();
}

export function hasAuthSession() {
  return Boolean(getAccessToken() && getStoredUser());
}

export { getAccessToken };
