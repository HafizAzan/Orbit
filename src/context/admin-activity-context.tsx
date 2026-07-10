import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACTIVITIES_PAGE_SIZE, type ActivityRecord } from "../data/admin-activity";
import {
  useAdminActivityList,
  useAdminActivityStats,
  useFlagAdminActivity,
  useResolveAdminActivity,
  useUnflagAdminActivity,
} from "../hooks/use-admin-activity";
import type { FlagActivityInput } from "../lib/activity-review";
import { showApiErrorToast } from "../lib/api-error";
import { toast } from "../lib/toast";

type AdminActivityContextValue = {
  activities: ActivityRecord[];
  flaggedActivities: ActivityRecord[];
  flaggedCount: number;
  isLoading: boolean;
  total: number;
  page: number;
  setPage: (page: number) => void;
  flagActivity: (id: string, input: FlagActivityInput) => void;
  resolveActivity: (id: string) => void;
  unflagActivity: (id: string) => void;
};

const AdminActivityContext = createContext<AdminActivityContextValue | undefined>(undefined);

type AdminActivityProviderProps = {
  children: ReactNode;
};

function AdminActivityProvider({ children }: AdminActivityProviderProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminActivityList({ page, limit: ACTIVITIES_PAGE_SIZE });
  const { data: flaggedPage } = useAdminActivityList({ page: 1, limit: 50, flagged: true });
  const { data: stats } = useAdminActivityStats();
  const flagMutation = useFlagAdminActivity();
  const resolveMutation = useResolveAdminActivity();
  const unflagMutation = useUnflagAdminActivity();

  const activities = data?.data ?? [];
  const flaggedActivities = flaggedPage?.data ?? [];
  const flaggedCount = stats?.flagged.value ?? flaggedActivities.length;

  const flagActivity = useCallback(
    (id: string, input: FlagActivityInput) => {
      void flagMutation
        .mutateAsync({
          id,
          data: { reason: input.reason, note: input.note },
        })
        .then(() => toast.success("Event flagged for manual review"))
        .catch(showApiErrorToast);
    },
    [flagMutation],
  );

  const resolveActivity = useCallback(
    (id: string) => {
      void resolveMutation
        .mutateAsync(id)
        .then(() => toast.success("Review marked as resolved"))
        .catch(showApiErrorToast);
    },
    [resolveMutation],
  );

  const unflagActivity = useCallback(
    (id: string) => {
      void unflagMutation
        .mutateAsync(id)
        .then(() => toast.info("Flag removed from event"))
        .catch(showApiErrorToast);
    },
    [unflagMutation],
  );

  const value = useMemo(
    () => ({
      activities,
      flaggedActivities,
      flaggedCount,
      isLoading,
      total: data?.total ?? 0,
      page,
      setPage,
      flagActivity,
      resolveActivity,
      unflagActivity,
    }),
    [
      activities,
      flaggedActivities,
      flaggedCount,
      isLoading,
      data?.total,
      page,
      flagActivity,
      resolveActivity,
      unflagActivity,
    ],
  );

  return <AdminActivityContext.Provider value={value}>{children}</AdminActivityContext.Provider>;
}

function useAdminActivity() {
  const context = useContext(AdminActivityContext);

  if (context === undefined) {
    throw new Error("useAdminActivity must be used within AdminActivityProvider");
  }

  return context;
}

export { AdminActivityProvider, useAdminActivity };
