const ACCESS_TOKEN_COOKIE = "flow-sync.access_token";

const REMEMBER_ME_MAX_AGE_SECONDS = 15 * 24 * 60 * 60;
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function escapeCookieName(name: string) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function setAccessToken(token: string, remember = false) {
  const maxAge = remember ? REMEMBER_ME_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function readAccessTokenFromCookie(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapeCookieName(ACCESS_TOKEN_COOKIE)}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAccessToken() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
}

export { REMEMBER_ME_MAX_AGE_SECONDS, SESSION_MAX_AGE_SECONDS };
