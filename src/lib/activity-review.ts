import type { ActivityFlagReason, ActivityRecord } from "../data/admin-activity";

export type FlagActivityInput = {
  reason: ActivityFlagReason;
  note?: string;
};

export function flagActivityRecord(record: ActivityRecord, input: FlagActivityInput): ActivityRecord {
  return {
    ...record,
    reviewStatus: "flagged",
    flagReason: input.reason,
    flagNote: input.note?.trim() || undefined,
    flaggedAt: "Just now",
    resolvedAt: undefined,
  };
}

export function resolveActivityRecord(record: ActivityRecord): ActivityRecord {
  return {
    ...record,
    reviewStatus: "resolved",
    resolvedAt: "Just now",
  };
}

export function unflagActivityRecord(record: ActivityRecord): ActivityRecord {
  return {
    ...record,
    reviewStatus: "none",
    flagReason: undefined,
    flagNote: undefined,
    flaggedAt: undefined,
    resolvedAt: undefined,
  };
}

export function getFlaggedActivities(activities: ActivityRecord[]): ActivityRecord[] {
  return activities.filter((activity) => activity.reviewStatus === "flagged");
}

export function countFlaggedActivities(activities: ActivityRecord[]): number {
  return getFlaggedActivities(activities).length;
}

export function getActivityFlagReasonLabel(reason: ActivityFlagReason): string {
  const labels: Record<ActivityFlagReason, string> = {
    security: "Security concern",
    billing: "Billing issue",
    compliance: "Compliance review",
    system: "System anomaly",
    other: "Other",
  };

  return labels[reason];
}
