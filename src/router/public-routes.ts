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
  ACCEPT_INVITE: "/accept-invite",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  VERIFY_OTP: "/verify-otp",
  TWO_FACTOR: "/two-factor",
  GITHUB_CALLBACK: "/auth/github/callback",
  GOOGLE_CALLBACK: "/auth/google/callback",
  ABOUT: "/about",
  CONTACT: "/contact",
  HELP: "/help",
  TERMS: "/terms-of-service",
  PRIVACY: "/privacy-policy",
};

const AUTH_ROUTE_KEYS = ["LOGIN", "REGISTER", "ACCEPT_INVITE", "FORGOT_PASSWORD", "VERIFY_EMAIL", "VERIFY_OTP", "TWO_FACTOR", "RESET_PASSWORD", "GITHUB_CALLBACK", "GOOGLE_CALLBACK"] as const;

function resolvePageImport(key: string) {
  const routePath = UN_AUTH_ROUTES[key];
  // Vite dynamic imports only allow one path segment; nested routes map to flat files
  // e.g. /auth/github/callback → pages/auth-github-callback.tsx
  const fileName =
    routePath === "/" ? "home" : routePath.replace(/^\//, "").replace(/\//g, "-");

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

export const APP_NOT_FOUND_ROUTE: Route = {
  path: "*",
  name: "NOT_FOUND",
  component: lazy(() => import("../pages/not-found")),
};

export const LIST = { AUTH_ROUTES_LIST, PUBLIC_ROUTES_LIST, UN_AUTH_ROUTES_LIST };
export { UN_AUTH_ROUTES };
