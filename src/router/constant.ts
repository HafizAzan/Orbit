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

const UN_AUTH_ROUTES_LIST: Route[] = Object.entries(UN_AUTH_ROUTES).map(([key, value]) => ({
  path: value,
  name: key,
  component: lazy(() => import(`../pages/${key.toLowerCase()}.tsx`)),
}));

export const LIST = { UN_AUTH_ROUTES_LIST };
export { UN_AUTH_ROUTES };
