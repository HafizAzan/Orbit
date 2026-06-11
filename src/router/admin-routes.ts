import { lazy } from "react";

export type AdminRoute = {
  path: string;
  name: string;
  component: React.ComponentType;
};

export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  ORGANIZATIONS: "/admin/organizations",
  SUBSCRIPTIONS: "/admin/subscriptions",
  USERS: "/admin/users",
  ACTIVITY: "/admin/activity",
  ACTIVITY_REVIEW: "/admin/activity-review",
  SETTINGS: "/admin/settings",
  PROFILE: "/admin/profile",
} as const;

const ADMIN_ROUTE_KEYS = [
  "DASHBOARD",
  "ORGANIZATIONS",
  "SUBSCRIPTIONS",
  "USERS",
  "ACTIVITY",
  "ACTIVITY_REVIEW",
  "SETTINGS",
  "PROFILE",
] as const;

function resolveAdminPageImport(key: string) {
  const routePath = ADMIN_ROUTES[key as keyof typeof ADMIN_ROUTES];
  const fileName = routePath.replace("/admin/", "");

  return import(`../pages/admin/${fileName}.tsx`);
}

function createAdminRoutes(keys: readonly string[]): AdminRoute[] {
  return keys.map((key) => ({
    path: ADMIN_ROUTES[key as keyof typeof ADMIN_ROUTES],
    name: key,
    component: lazy(() => resolveAdminPageImport(key)),
  }));
}

export const ADMIN_ROUTES_LIST = createAdminRoutes(ADMIN_ROUTE_KEYS);
