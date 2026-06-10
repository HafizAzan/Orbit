import { lazy } from "react";

export type Route = {
  path: string;
  name: string;
  component: React.ComponentType;
};

const UN_AUTH_ROUTES: Record<string, string> = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  VERIFY_OTP: "/verify-otp",
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
};

const AUTH_ROUTE_KEYS = ["LOGIN", "REGISTER", "FORGOT_PASSWORD", "VERIFY_EMAIL", "VERIFY_OTP", "RESET_PASSWORD"] as const;

function resolvePageImport(key: string) {
  const routePath = UN_AUTH_ROUTES[key];
  const fileName = routePath === "/" ? "home" : routePath.replace(/^\//, "");

  return import(`../pages/${fileName}.tsx`);
}

function createRoutes(keys: readonly string[]): Route[] {
  return keys.map((key) => ({
    path: UN_AUTH_ROUTES[key],
    name: key,
    component: lazy(() => resolvePageImport(key)),
  }));
}

const PUBLIC_ROUTE_KEYS = Object.keys(UN_AUTH_ROUTES).filter(
  (key) => !AUTH_ROUTE_KEYS.includes(key as (typeof AUTH_ROUTE_KEYS)[number]),
);

const AUTH_ROUTES_LIST = createRoutes(AUTH_ROUTE_KEYS);
const PUBLIC_ROUTES_LIST = createRoutes(PUBLIC_ROUTE_KEYS);
const UN_AUTH_ROUTES_LIST = createRoutes(Object.keys(UN_AUTH_ROUTES));

export const LIST = { AUTH_ROUTES_LIST, PUBLIC_ROUTES_LIST, UN_AUTH_ROUTES_LIST };
export { UN_AUTH_ROUTES };
