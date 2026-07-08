import { lazy, type ComponentType } from "react";
import { PLAN_ROUTES, SUBSCRIPTION_PENDING_ROUTES } from "../lib/auth-routing";

export type AuthProtectedRoute = {
  path: string;
  name: string;
  component: ComponentType;
};

const AUTH_PROTECTED_ROUTE_CONFIGS = [
  { name: "CHOOSE_PLAN", path: PLAN_ROUTES.CHOOSE_PLAN, pageFile: "choose-plan" },
  { name: "CHECKOUT_SUCCESS", path: PLAN_ROUTES.CHECKOUT_SUCCESS, pageFile: "choose-plan-checkout-success" },
  { name: "CHECKOUT_CANCEL", path: PLAN_ROUTES.CHECKOUT_CANCEL, pageFile: "choose-plan-checkout-cancel" },
  {
    name: "WORKSPACE_PENDING",
    path: SUBSCRIPTION_PENDING_ROUTES.WORKSPACE_PENDING,
    pageFile: "workspace-subscription-pending",
  },
] as const;

export const AUTH_PROTECTED_ROUTES_LIST: AuthProtectedRoute[] = AUTH_PROTECTED_ROUTE_CONFIGS.map(
  ({ name, path, pageFile }) => ({
    name,
    path,
    component: lazy(() => import(`../pages/${pageFile}.tsx`)),
  }),
);
