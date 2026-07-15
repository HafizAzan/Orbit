const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const API_ORIGIN = API_BASE.replace(/\/api\/v\d+$/i, "");

/** Resolve backend asset paths to a browser-loadable absolute URL. */
export function resolveTaskAttachmentUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;

  // Backend already returns `/api/v1/uploads/...` while VITE_API_URL includes `/api/v1`.
  if (normalized.startsWith("/api/")) {
    return `${API_ORIGIN}${normalized}`;
  }

  return `${API_BASE}${normalized}`;
}
