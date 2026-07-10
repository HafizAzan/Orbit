import type { ActivityRecord } from "../data/admin-activity";
import type { AdminNotification } from "../data/admin-notifications";
import { ADMIN_ROUTES } from "../router/admin-routes";
import { formatRelativeTime } from "./helper";

function mapCategoryToKind(category: ActivityRecord["category"]): AdminNotification["kind"] {
  switch (category) {
    case "billing":
    case "subscription":
      return "billing";
    case "organization":
      return "organization";
    case "user":
      return "user";
    default:
      return "system";
  }
}

export function buildAdminNotificationsFromActivity(input: {
  flaggedCount: number;
  flaggedActivities: ActivityRecord[];
  recentActivities: ActivityRecord[];
}): AdminNotification[] {
  const notifications: AdminNotification[] = [];

  if (input.flaggedCount > 0) {
    notifications.push({
      id: "review-queue",
      title: "Review queue updated",
      message: `${input.flaggedCount} event${input.flaggedCount === 1 ? "" : "s"} waiting for manual review.`,
      timeAgo: formatRelativeTime(input.flaggedActivities[0]?.flaggedAt ?? input.flaggedActivities[0]?.timestamp) ?? "Just now",
      read: false,
      kind: "review",
      href: ADMIN_ROUTES.ACTIVITY_REVIEW,
    });
  }

  for (const activity of input.recentActivities.slice(0, 6)) {
    if (notifications.some((item) => item.id === `activity-${activity.id}`)) continue;

    notifications.push({
      id: `activity-${activity.id}`,
      title: activity.title,
      message: activity.description,
      timeAgo: formatRelativeTime(activity.timestamp) ?? activity.timestamp,
      read: activity.reviewStatus !== "flagged",
      kind: activity.reviewStatus === "flagged" ? "review" : mapCategoryToKind(activity.category),
      href: activity.reviewStatus === "flagged" ? ADMIN_ROUTES.ACTIVITY_REVIEW : ADMIN_ROUTES.ACTIVITY,
    });
  }

  return notifications.slice(0, 8);
}
