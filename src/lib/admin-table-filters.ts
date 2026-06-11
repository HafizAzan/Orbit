export function parseListParam<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
}

export function setListParam(params: URLSearchParams, key: string, values: string[]) {
  if (values.length) {
    params.set(key, values.join(","));
  } else {
    params.delete(key);
  }
}
