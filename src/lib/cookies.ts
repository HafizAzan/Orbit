const ACCESS_TOKEN_COOKIE = "flow-sync.access_token";
const TOKEN_MAX_AGE_DAYS = 7;

function escapeCookieName(name: string) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function setAccessToken(token: string) {
  const maxAge = TOKEN_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapeCookieName(ACCESS_TOKEN_COOKIE)}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAccessToken() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
}
