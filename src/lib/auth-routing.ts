import { ADMIN_ROUTES } from "../router/admin-routes";
import { UN_AUTH_ROUTES } from "../router/public-routes";
import type { AuthUser } from "../types/auth.types";

export function isPlatformAdminUser(user: AuthUser) {
  return user.role === "super_admin" || user.isPlatformAdmin;
}

export function getPostAuthRedirectPath(user: AuthUser) {
  if (isPlatformAdminUser(user)) {
    return ADMIN_ROUTES.DASHBOARD;
  }

  return UN_AUTH_ROUTES.HOME;
}

export function getAuthenticatedHeaderAction(user: AuthUser) {
  if (isPlatformAdminUser(user)) {
    return {
      label: "Dashboard",
      path: ADMIN_ROUTES.DASHBOARD,
    };
  }

  return {
    label: "Home",
    path: UN_AUTH_ROUTES.HOME,
  };
}
