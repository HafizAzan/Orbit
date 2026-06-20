export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export const DEFAULT_LIST_PAGE = 1;
export const DEFAULT_LIST_LIMIT = 100;

export function buildPaginationSearchParams(
  params: PaginationParams = {},
): URLSearchParams {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? DEFAULT_LIST_PAGE),
    limit: String(params.limit ?? DEFAULT_LIST_LIMIT),
  });

  return searchParams;
}

export function normalizePaginatedResponse<T>(
  data: unknown,
  fallbackLimit = DEFAULT_LIST_LIMIT,
): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    return {
      data: data as T[],
      page: 1,
      limit: data.length || fallbackLimit,
      total: data.length,
    };
  }

  const response = data as Partial<PaginatedResponse<T>>;

  return {
    data: response.data ?? [],
    page: response.page ?? 1,
    limit: response.limit ?? fallbackLimit,
    total: response.total ?? response.data?.length ?? 0,
  };
}
