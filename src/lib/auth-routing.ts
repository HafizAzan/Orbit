import { ADMIN_ROUTES } from "../router/admin-routes";
import { WORKSPACE_ROUTES } from "../router/workspace-routes";
import { getWorkspaceHomePath } from "./workspace-routing";
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

export const SUBSCRIPTION_PENDING_ROUTES = {
  WORKSPACE_PENDING: "/workspace-pending",
} as const;

export const PLAN_ONBOARDING_PATHS = new Set<string>([
  PLAN_ROUTES.CHOOSE_PLAN,
  PLAN_ROUTES.CHECKOUT_SUCCESS,
  PLAN_ROUTES.CHECKOUT_CANCEL,
]);

export function isOrganizationAwaitingSubscription(user: AuthUser) {
  return user.organizationAwaitingSubscription;
}

export function shouldRedirectToChoosePlan(user: AuthUser) {
  if (user.role !== "owner" && user.role !== "admin") {
    return false;
  }

  return user.requiresPlanSelection || user.organizationAwaitingSubscription;
}

export function shouldRedirectToWorkspacePending(user: AuthUser) {
  if (user.role !== "manager" && user.role !== "member") {
    return false;
  }

  return user.organizationAwaitingSubscription;
}

export function getPostAuthRedirectPath(user: AuthUser) {
  if (isPlatformAdminUser(user)) {
    return ADMIN_ROUTES.DASHBOARD;
  }

  if (shouldRedirectToWorkspacePending(user)) {
    return SUBSCRIPTION_PENDING_ROUTES.WORKSPACE_PENDING;
  }

  if (shouldRedirectToChoosePlan(user)) {
    return PLAN_ROUTES.CHOOSE_PLAN;
  }

  return getWorkspaceHomePath(user.role);
}

export function getAuthenticatedHeaderAction(user: AuthUser) {
  if (isPlatformAdminUser(user)) {
    return {
      label: "Dashboard",
      path: ADMIN_ROUTES.DASHBOARD,
    };
  }

  if (shouldRedirectToWorkspacePending(user)) {
    return {
      label: "Workspace status",
      path: SUBSCRIPTION_PENDING_ROUTES.WORKSPACE_PENDING,
    };
  }

  if (shouldRedirectToChoosePlan(user)) {
    return {
      label: "Choose plan",
      path: PLAN_ROUTES.CHOOSE_PLAN,
    };
  }

  if (user.role === "member") {
    return {
      label: "My Tasks",
      path: WORKSPACE_ROUTES.MY_TASKS,
    };
  }

  return {
    label: "Dashboard",
    path: WORKSPACE_ROUTES.DASHBOARD,
  };
}
