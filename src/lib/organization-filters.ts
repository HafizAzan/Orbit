import type {
  OrganizationCreatedDateFilter,
  OrganizationPlan,
  OrganizationRecord,
  OrganizationStatus,
} from "../data/admin-organizations";

export const ORGANIZATION_FILTER_PARAMS = {
  status: "status",
  plan: "plan",
  created: "created",
} as const;

export type OrganizationFilters = {
  statuses: OrganizationStatus[];
  plans: OrganizationPlan[];
  createdWithin: OrganizationCreatedDateFilter;
};

export const DEFAULT_ORGANIZATION_FILTERS: OrganizationFilters = {
  statuses: [],
  plans: [],
  createdWithin: "all",
};

const CREATED_WITHIN_DAYS: Record<Exclude<OrganizationCreatedDateFilter, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function parseListParam<T extends string>(value: string | null, allowed: readonly T[]): T[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
}

export function parseOrganizationFilters(searchParams: URLSearchParams): OrganizationFilters {
  const created = searchParams.get(ORGANIZATION_FILTER_PARAMS.created);
  const createdWithin: OrganizationCreatedDateFilter =
    created === "7d" || created === "30d" || created === "90d" ? created : "all";

  return {
    statuses: parseListParam(searchParams.get(ORGANIZATION_FILTER_PARAMS.status), ["active", "trial", "suspended"] as const),
    plans: parseListParam(searchParams.get(ORGANIZATION_FILTER_PARAMS.plan), ["ENTERPRISE", "BUSINESS", "PRO", "FREE"] as const),
    createdWithin,
  };
}

export function applyOrganizationFiltersToSearchParams(filters: OrganizationFilters, current: URLSearchParams) {
  const next = new URLSearchParams(current);

  if (filters.statuses.length) {
    next.set(ORGANIZATION_FILTER_PARAMS.status, filters.statuses.join(","));
  } else {
    next.delete(ORGANIZATION_FILTER_PARAMS.status);
  }

  if (filters.plans.length) {
    next.set(ORGANIZATION_FILTER_PARAMS.plan, filters.plans.join(","));
  } else {
    next.delete(ORGANIZATION_FILTER_PARAMS.plan);
  }

  if (filters.createdWithin !== "all") {
    next.set(ORGANIZATION_FILTER_PARAMS.created, filters.createdWithin);
  } else {
    next.delete(ORGANIZATION_FILTER_PARAMS.created);
  }

  return next;
}

export function countActiveOrganizationFilters(filters: OrganizationFilters) {
  let count = filters.statuses.length + filters.plans.length;
  if (filters.createdWithin !== "all") count += 1;
  return count;
}

export function matchesOrganizationFilters(organization: OrganizationRecord, filters: OrganizationFilters) {
  if (filters.statuses.length > 0 && !filters.statuses.includes(organization.status)) {
    return false;
  }

  if (filters.plans.length > 0 && !filters.plans.includes(organization.plan.code)) {
    return false;
  }

  if (filters.createdWithin !== "all") {
    const days = CREATED_WITHIN_DAYS[filters.createdWithin];
    const createdAt = new Date(organization.createdAt);
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - days);

    if (createdAt < cutoff) {
      return false;
    }
  }

  return true;
}

export function getOrganizationFilterChips(filters: OrganizationFilters) {
  const chips: { key: string; label: string }[] = [];

  filters.statuses.forEach((status) => {
    chips.push({ key: `status-${status}`, label: `Status: ${status.charAt(0).toUpperCase()}${status.slice(1)}` });
  });

  filters.plans.forEach((plan) => {
    chips.push({ key: `plan-${plan}`, label: `Plan: ${plan.charAt(0)}${plan.slice(1).toLowerCase()}` });
  });

  if (filters.createdWithin !== "all") {
    const labelMap: Record<Exclude<OrganizationCreatedDateFilter, "all">, string> = {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
    };
    chips.push({ key: `created-${filters.createdWithin}`, label: `Created: ${labelMap[filters.createdWithin]}` });
  }

  return chips;
}
