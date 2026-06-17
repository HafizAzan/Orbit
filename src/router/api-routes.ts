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
    INVITE_VALIDATE: "/auth/invites/validate",
    INVITE_ACCEPT: "/auth/invites/accept",
  },
  ADMIN: {
    ORGANIZATIONS: "/admin/organizations",
    ORGANIZATION_STATS: "/admin/organizations/stats",
    SUBSCRIPTIONS: "/admin/subscriptions",
    SUBSCRIPTION_STATS: "/admin/subscriptions/stats",
    SUBSCRIPTION_PLAN_DISTRIBUTION: "/admin/subscriptions/plan-distribution",
  },
  ORGANIZATIONS: {
    ME: "/organizations/me",
    MEMBERS: "/organizations/me/members",
  },
  TEAMS: {
    MEMBERS: "/teams/members",
    STATS: "/teams/stats",
    INVITES: "/teams/invites",
    RESEND_PENDING: "/teams/invites/resend-pending",
  },
  PROJECTS: {
    LIST: "/projects",
    ASSIGNABLE_MEMBERS: "/projects/assignable-members",
  },
  TASKS: {
    LIST: "/tasks",
    MY: "/tasks/my",
    DASHBOARD: "/tasks/dashboard",
    REPORTS: "/tasks/reports",
    BOARDS: "/tasks/boards",
  },
  BILLING: {
    CATALOG: "/billing/catalog",
    SUBSCRIPTION: "/billing/subscription",
    CHECKOUT: "/billing/checkout",
    CHECKOUT_CONFIRM: "/billing/checkout/confirm",
    SELECT_PLAN: "/billing/select-plan",
    CANCEL: "/billing/cancel",
    CHANGE_PLAN: "/billing/change-plan",
    REFUND: "/billing/refund",
    INVOICES: "/billing/invoices",
  },
};

export default API_ROUTES;
