const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export function resolveTaskAttachmentUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}
