import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACTIVITIES_DATA, type ActivityRecord } from "../data/admin-activity";
import {
  countFlaggedActivities,
  flagActivityRecord,
  getFlaggedActivities,
  resolveActivityRecord,
  unflagActivityRecord,
  type FlagActivityInput,
} from "../lib/activity-review";
import { toast } from "../lib/toast";

type AdminActivityContextValue = {
  activities: ActivityRecord[];
  flaggedActivities: ActivityRecord[];
  flaggedCount: number;
  deleteActivities: (ids: string[]) => void;
  flagActivity: (id: string, input: FlagActivityInput) => void;
  resolveActivity: (id: string) => void;
  unflagActivity: (id: string) => void;
};

const AdminActivityContext = createContext<AdminActivityContextValue | undefined>(undefined);

type AdminActivityProviderProps = {
  children: ReactNode;
  initialActivities?: ActivityRecord[];
};

function AdminActivityProvider({ children, initialActivities = ACTIVITIES_DATA }: AdminActivityProviderProps) {
  const [activities, setActivities] = useState<ActivityRecord[]>(initialActivities);

  const deleteActivities = useCallback((ids: string[]) => {
    setActivities((current) => current.filter((activity) => !ids.includes(activity.id)));
  }, []);

  const updateActivity = useCallback((id: string, updater: (record: ActivityRecord) => ActivityRecord) => {
    setActivities((current) => current.map((activity) => (activity.id === id ? updater(activity) : activity)));
  }, []);

  const flagActivity = useCallback(
    (id: string, input: FlagActivityInput) => {
      updateActivity(id, (record) => flagActivityRecord(record, input));
      toast.success("Event flagged for manual review");
    },
    [updateActivity],
  );

  const resolveActivity = useCallback(
    (id: string) => {
      updateActivity(id, resolveActivityRecord);
      toast.success("Review marked as resolved");
    },
    [updateActivity],
  );

  const unflagActivity = useCallback(
    (id: string) => {
      updateActivity(id, unflagActivityRecord);
      toast.info("Flag removed from event");
    },
    [updateActivity],
  );

  const flaggedActivities = useMemo(() => getFlaggedActivities(activities), [activities]);
  const flaggedCount = useMemo(() => countFlaggedActivities(activities), [activities]);

  const value = useMemo(
    () => ({
      activities,
      flaggedActivities,
      flaggedCount,
      deleteActivities,
      flagActivity,
      resolveActivity,
      unflagActivity,
    }),
    [activities, flaggedActivities, flaggedCount, deleteActivities, flagActivity, resolveActivity, unflagActivity],
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
