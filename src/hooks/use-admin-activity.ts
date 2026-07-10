import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flagAdminActivity,
  getAdminActivityStats,
  listAdminActivityPage,
  resolveAdminActivity,
  unflagAdminActivity,
  type FlagAdminActivityRequest,
} from "../api-services/admin-activity.service";
import type { ActivityReviewStatus } from "../data/admin-activity";
import type { PaginationParams } from "../types/pagination.types";

export function useAdminActivityList(
  params: PaginationParams & {
    search?: string;
    reviewStatus?: ActivityReviewStatus;
    flagged?: boolean;
  } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  return useQuery({
    queryKey: [
      "admin-activity",
      page,
      limit,
      params.search ?? "",
      params.reviewStatus ?? "",
      params.flagged ? "1" : "0",
    ],
    queryFn: () => listAdminActivityPage({ ...params, page, limit }),
  });
}

export function useAdminActivityStats() {
  return useQuery({
    queryKey: ["admin-activity-stats"],
    queryFn: getAdminActivityStats,
  });
}

function invalidateActivity(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
  queryClient.invalidateQueries({ queryKey: ["admin-activity-stats"] });
}

export function useFlagAdminActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FlagAdminActivityRequest }) =>
      flagAdminActivity(id, data),
    onSuccess: () => invalidateActivity(queryClient),
  });
}

export function useResolveAdminActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resolveAdminActivity(id),
    onSuccess: () => invalidateActivity(queryClient),
  });
}

export function useUnflagAdminActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unflagAdminActivity(id),
    onSuccess: () => invalidateActivity(queryClient),
  });
}
