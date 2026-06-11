import type { ActivityRecord, ActivitySeverity, ActivityTabKey } from "../data/admin-activity";
import { parseListParam, setListParam } from "./admin-table-filters";

export const ACTIVITY_FILTER_PARAMS = {
  severity: "actSeverity",
  eventTab: "actTab",
} as const;

const ACTIVITY_SEVERITIES = ["info", "success", "warning", "critical"] as const;
const ACTIVITY_TAB_KEYS = ["all", "organization", "subscription", "user", "billing"] as const;

export type ActivityEventTabKey = (typeof ACTIVITY_TAB_KEYS)[number];

export type ActivityFilters = {
  severities: ActivitySeverity[];
  eventTab: ActivityEventTabKey;
};

export const DEFAULT_ACTIVITY_FILTERS: ActivityFilters = {
  severities: [],
  eventTab: "all",
};

function isActivityEventTabKey(value: string | null): value is ActivityEventTabKey {
  return value !== null && (ACTIVITY_TAB_KEYS as readonly string[]).includes(value);
}

export function parseActivityFilters(searchParams: URLSearchParams): ActivityFilters {
  const tab = searchParams.get(ACTIVITY_FILTER_PARAMS.eventTab);
  const eventTab: ActivityEventTabKey = isActivityEventTabKey(tab) ? tab : "all";

  return {
    severities: parseListParam(searchParams.get(ACTIVITY_FILTER_PARAMS.severity), ACTIVITY_SEVERITIES),
    eventTab,
  };
}

export function applyActivityFiltersToSearchParams(filters: ActivityFilters, current: URLSearchParams) {
  const next = new URLSearchParams(current);

  setListParam(next, ACTIVITY_FILTER_PARAMS.severity, filters.severities);

  if (filters.eventTab !== "all") {
    next.set(ACTIVITY_FILTER_PARAMS.eventTab, filters.eventTab);
  } else {
    next.delete(ACTIVITY_FILTER_PARAMS.eventTab);
  }

  return next;
}

export function countActiveActivityFilters(filters: ActivityFilters) {
  let count = filters.severities.length;
  if (filters.eventTab !== "all") count += 1;
  return count;
}

export function matchesActivityFilters(activity: ActivityRecord, filters: ActivityFilters) {
  if (filters.severities.length > 0 && !filters.severities.includes(activity.severity)) {
    return false;
  }

  if (filters.eventTab !== "all" && activity.category !== filters.eventTab) {
    return false;
  }

  return true;
}

export function getActivityFilterChips(filters: ActivityFilters) {
  const chips: { key: string; label: string }[] = [];

  const severityLabels: Record<ActivitySeverity, string> = {
    info: "Info",
    success: "Success",
    warning: "Warning",
    critical: "Critical",
  };

  const eventTabLabels: Record<ActivityTabKey, string> = {
    all: "All Events",
    organization: "Organizations",
    subscription: "Subscriptions",
    user: "Users",
    billing: "Billing",
    system: "System",
  };

  if (filters.eventTab !== "all") {
    chips.push({ key: `event-${filters.eventTab}`, label: `Event: ${eventTabLabels[filters.eventTab]}` });
  }

  filters.severities.forEach((severity) => {
    chips.push({ key: `severity-${severity}`, label: `Severity: ${severityLabels[severity]}` });
  });

  return chips;
}
