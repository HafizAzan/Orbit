const API_ROUTES: Record<string, Record<string, string>> = {
  AUTH: {
    REGISTER_SEND_OTP: "/auth/register/send-otp",
    REGISTER_PENDING: "/auth/register/pending",
    REGISTER_RESEND_OTP: "/auth/register/resend-otp",
    REGISTER_VERIFY: "/auth/register/verify",
    ME: "/auth/me",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    RESET_PASSWORD_VALIDATE: "/auth/reset-password/validate",
  },
  ADMIN: {
    ORGANIZATIONS: "/admin/organizations",
    ORGANIZATION_STATS: "/admin/organizations/stats",
    SUBSCRIPTIONS: "/admin/subscriptions",
    SUBSCRIPTION_STATS: "/admin/subscriptions/stats",
    SUBSCRIPTION_PLAN_DISTRIBUTION: "/admin/subscriptions/plan-distribution",
  },
  BILLING: {
    CATALOG: "/billing/catalog",
    SUBSCRIPTION: "/billing/subscription",
    CHECKOUT: "/billing/checkout",
    CANCEL: "/billing/cancel",
    CHANGE_PLAN: "/billing/change-plan",
    REFUND: "/billing/refund",
    INVOICES: "/billing/invoices",
  },
};

export default API_ROUTES;
