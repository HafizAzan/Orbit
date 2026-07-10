import type { PlanFeatureFlag } from "../types/billing.types";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";

export function hasPlanFeature(
  featureFlags: readonly string[] | undefined,
  flag: PlanFeatureFlag | string,
) {
  return Boolean(featureFlags?.includes(flag));
}

export function hasAnyPlanFeature(
  featureFlags: readonly string[] | undefined,
  flags: readonly (PlanFeatureFlag | string)[],
) {
  return flags.some((flag) => hasPlanFeature(featureFlags, flag));
}

const NAV_FEATURE_REQUIREMENTS: Record<string, PlanFeatureFlag[]> = {
  dashboard: ["team_dashboards", "basic_reporting"],
  reports: ["reports", "workload_reports"],
  boards: ["boards"],
  projects: ["projects"],
  tasks: ["tasks"],
};

export function canAccessNavKey(
  navKey: string,
  featureFlags: readonly string[] | undefined,
) {
  const required = NAV_FEATURE_REQUIREMENTS[navKey];

  if (!required?.length) {
    return true;
  }

  // Until usage loads, keep nav visible to avoid flicker for entitled plans.
  if (!featureFlags) {
    return true;
  }

  return hasAnyPlanFeature(featureFlags, required);
}

export function canAccessPathWithPlan(
  pathname: string,
  featureFlags: readonly string[] | undefined,
) {
  if (!featureFlags) {
    return true;
  }

  if (pathname === WORKSPACE_ROUTES.DASHBOARD) {
    return hasAnyPlanFeature(featureFlags, ["team_dashboards", "basic_reporting"]);
  }

  if (pathname === WORKSPACE_ROUTES.REPORTS) {
    return hasAnyPlanFeature(featureFlags, ["reports", "workload_reports"]);
  }

  if (pathname.startsWith(WORKSPACE_ROUTES.PROJECTS)) {
    return hasPlanFeature(featureFlags, "projects");
  }

  if (pathname === WORKSPACE_ROUTES.BOARDS || pathname.includes("/board")) {
    return hasPlanFeature(featureFlags, "boards");
  }

  if (pathname === WORKSPACE_ROUTES.TASKS || pathname.startsWith(`${WORKSPACE_ROUTES.TASKS}/`)) {
    return hasPlanFeature(featureFlags, "tasks");
  }

  return true;
}

export function formatUsageLimit(used: number, limit: number | null, unlimited: boolean) {
  if (unlimited || limit == null || limit < 0) {
    return `${used} / Unlimited`;
  }

  return `${used} / ${limit}`;
}

export function usagePercent(used: number, limit: number | null, unlimited: boolean) {
  if (unlimited || limit == null || limit <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((used / limit) * 100));
}
