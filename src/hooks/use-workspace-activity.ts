import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteActivity, getActivities, getActivityFeed } from "../api-services/activity.service";
import type { PaginationParams } from "../types/pagination.types";

export const WORKSPACE_ACTIVITY_FEED_QUERY_KEY = ["workspace-activity-feed"] as const;
export const WORKSPACE_ACTIVITY_LIST_QUERY_KEY = ["workspace-activity-list"] as const;

const ACTIVITY_POLL_INTERVAL_MS = 30_000;

export function useWorkspaceActivityFeed(enabled = true) {
  return useQuery({
    queryKey: WORKSPACE_ACTIVITY_FEED_QUERY_KEY,
    queryFn: getActivityFeed,
    enabled,
    refetchInterval: ACTIVITY_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useWorkspaceActivities(params: PaginationParams = {}, enabled = true) {
  return useQuery({
    queryKey: [...WORKSPACE_ACTIVITY_LIST_QUERY_KEY, params],
    queryFn: () => getActivities(params),
    enabled,
    refetchInterval: ACTIVITY_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useDeleteWorkspaceActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) => deleteActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ACTIVITY_FEED_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ACTIVITY_LIST_QUERY_KEY });
    },
  });
}
