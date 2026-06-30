export function getTabSlug<T extends string>(slugToKey: Record<T, string>, key: T) {
  return slugToKey[key];
}

export function resolveTabFromSlug<T extends string>(
  tab: string | null,
  slugToKey: Record<T, string>,
  defaultKey: T,
): T {
  if (!tab) return defaultKey;

  const match = Object.entries(slugToKey).find(([, slug]) => slug === tab);
  return match ? (match[0] as T) : defaultKey;
}

export function isValidTabSlug(tab: string | null, slugToKey: Record<string, string>) {
  if (!tab) return false;
  return Object.values(slugToKey).includes(tab);
}

export function setSearchParamValue(
  params: URLSearchParams,
  key: string,
  value: string | null,
) {
  if (value === null) {
    params.delete(key);
    return;
  }

  params.set(key, value);
}
