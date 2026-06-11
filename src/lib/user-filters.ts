import type { UserRecord, UserRole, UserStatus } from "../data/admin-users";
import { parseListParam, setListParam } from "./admin-table-filters";

export const USER_FILTER_PARAMS = {
  status: "userStatus",
  role: "userRole",
  organization: "userOrg",
} as const;

export type UserFilters = {
  statuses: UserStatus[];
  roles: UserRole[];
  organizations: string[];
};

export const DEFAULT_USER_FILTERS: UserFilters = {
  statuses: [],
  roles: [],
  organizations: [],
};

const USER_STATUSES = ["active", "pending", "suspended"] as const;
const USER_ROLES = ["Admin", "Manager", "Member"] as const;

export function parseUserFilters(searchParams: URLSearchParams): UserFilters {
  return {
    statuses: parseListParam(searchParams.get(USER_FILTER_PARAMS.status), USER_STATUSES),
    roles: parseListParam(searchParams.get(USER_FILTER_PARAMS.role), USER_ROLES),
    organizations: searchParams.get(USER_FILTER_PARAMS.organization)?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
  };
}

export function applyUserFiltersToSearchParams(filters: UserFilters, current: URLSearchParams) {
  const next = new URLSearchParams(current);

  setListParam(next, USER_FILTER_PARAMS.status, filters.statuses);
  setListParam(next, USER_FILTER_PARAMS.role, filters.roles);
  setListParam(next, USER_FILTER_PARAMS.organization, filters.organizations);

  return next;
}

export function countActiveUserFilters(filters: UserFilters) {
  return filters.statuses.length + filters.roles.length + filters.organizations.length;
}

export function matchesUserFilters(user: UserRecord, filters: UserFilters) {
  if (filters.statuses.length > 0 && !filters.statuses.includes(user.status)) {
    return false;
  }

  if (filters.roles.length > 0 && !filters.roles.includes(user.role)) {
    return false;
  }

  if (filters.organizations.length > 0 && !filters.organizations.includes(user.organization)) {
    return false;
  }

  return true;
}

export function getUserFilterChips(filters: UserFilters) {
  const chips: { key: string; label: string }[] = [];

  filters.statuses.forEach((status) => {
    chips.push({ key: `status-${status}`, label: `Status: ${status.charAt(0).toUpperCase()}${status.slice(1)}` });
  });

  filters.roles.forEach((role) => {
    chips.push({ key: `role-${role}`, label: `Role: ${role}` });
  });

  filters.organizations.forEach((organization) => {
    chips.push({ key: `org-${organization}`, label: `Organization: ${organization}` });
  });

  return chips;
}
