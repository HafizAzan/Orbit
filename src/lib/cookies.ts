const ACCESS_TOKEN_COOKIE = "flow-sync.access_token";
const REFRESH_TOKEN_COOKIE = "flow-sync.refresh_token";

const REMEMBER_ME_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const SESSION_MAX_AGE_SECONDS = 30 * 60;

function escapeCookieName(name: string) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapeCookieName(name)}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function setAccessToken(token: string, remember = false) {
  const maxAge = remember ? REMEMBER_ME_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  writeCookie(ACCESS_TOKEN_COOKIE, token, maxAge);
}

export function setRefreshToken(token: string, remember = false) {
  const maxAge = remember ? REMEMBER_ME_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  writeCookie(REFRESH_TOKEN_COOKIE, token, maxAge);
}

export function readAccessTokenFromCookie(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function readRefreshTokenFromCookie(): string | null {
  return readCookie(REFRESH_TOKEN_COOKIE);
}

export function clearAccessToken() {
  clearCookie(ACCESS_TOKEN_COOKIE);
}

export function clearRefreshToken() {
  clearCookie(REFRESH_TOKEN_COOKIE);
}

export { REMEMBER_ME_MAX_AGE_SECONDS, SESSION_MAX_AGE_SECONDS };
