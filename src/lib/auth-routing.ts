import { ADMIN_ROUTES } from "../router/admin-routes";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";
import type { AuthUser } from "../types/auth.types";

export function isPlatformAdminUser(user: AuthUser) {
  return user.role === "super_admin" || user.isPlatformAdmin;
}

export function canManageBilling(user: AuthUser) {
  return user.role === "owner" || user.role === "admin" || user.isPlatformAdmin;
}

export const PLAN_ROUTES = {
  CHOOSE_PLAN: "/choose-plan",
  CHECKOUT_SUCCESS: "/choose-plan/checkout/success",
  CHECKOUT_CANCEL: "/choose-plan/checkout/cancel",
} as const;

export function getPostAuthRedirectPath(user: AuthUser) {
  if (isPlatformAdminUser(user)) {
    return ADMIN_ROUTES.DASHBOARD;
  }

  if (user.requiresPlanSelection) {
    return PLAN_ROUTES.CHOOSE_PLAN;
  }

  return WORKSPACE_ROUTES.DASHBOARD;
}

export function getAuthenticatedHeaderAction(user: AuthUser) {
  if (isPlatformAdminUser(user)) {
    return {
      label: "Dashboard",
      path: ADMIN_ROUTES.DASHBOARD,
    };
  }

  return {
    label: "Dashboard",
    path: WORKSPACE_ROUTES.DASHBOARD,
  };
}
