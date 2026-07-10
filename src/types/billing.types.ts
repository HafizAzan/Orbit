export type PlanCode = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
export type SubscriptionStatus = "active" | "trial" | "expired" | "cancelled";
export type BillingCycle = "Monthly" | "Annual";
export type CatalogCtaType = "checkout" | "register" | "contact";

export type BillingCatalogPrice = {
  id: string;
  unitAmount: number;
  currency: string;
  billingCycle: BillingCycle;
  interval: string;
  intervalCount: number;
  priceSuffix: string;
  lookupKey: string | null;
};

export type BillingCatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  plan: PlanCode;
  metadata: Record<string, string>;
  features: string[];
  highlighted: boolean;
  badge: string | null;
  sortOrder: number;
  ctaLabel: string | null;
  ctaType: CatalogCtaType;
  prices: BillingCatalogPrice[];
};

export type BillingCatalogResponse = {
  products: BillingCatalogProduct[];
};

export type CurrentSubscriptionResponse = {
  organizationId: string;
  plan: PlanCode;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  renewalDate: string | null;
  expiresAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  lastPaymentAt: string | null;
};

export type PlanFeatureFlag =
  | "projects"
  | "boards"
  | "tasks"
  | "basic_reporting"
  | "advanced_workflows"
  | "team_dashboards"
  | "reports"
  | "multi_team"
  | "advanced_permissions"
  | "workload_reports"
  | "priority_support"
  | "dedicated_onboarding"
  | "sso"
  | "custom_roles"
  | "dedicated_success"
  | "custom_sla";

export type OrganizationUsageMetric = {
  key: "staff_users" | "projects" | "boards";
  label: string;
  used: number;
  limit: number | null;
  unlimited: boolean;
};

export type OrganizationUsageResponse = {
  organizationId: string;
  plan: PlanCode;
  productId: string | null;
  productName: string | null;
  status: SubscriptionStatus;
  features: string[];
  featureFlags: PlanFeatureFlag[];
  metadata: Record<string, string>;
  limits: {
    max_staff_users: number | null;
    max_projects: number | null;
    max_boards: number | null;
  };
  usage: {
    staffUsers: number;
    projects: number;
    boards: number;
  };
  metrics: OrganizationUsageMetric[];
};

export type BillingInvoice = {
  id: string;
  number: string | null;
  status: string | null;
  amountDue: number;
  amountPaid: number;
  currency: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
  createdAt: string;
  periodStart: string | null;
  periodEnd: string | null;
  refundable: boolean;
  refundWindowEndsAt: string | null;
};

export type BillingInvoicesResponse = {
  data: BillingInvoice[];
  page: number;
  limit: number;
  total: number;
};

export type CreateCheckoutRequest = {
  priceId: string;
};

export type CreateCheckoutResponse = {
  message: string;
  sessionId: string;
  url: string;
};

export type CancelPlanRequest = {
  cancelAtPeriodEnd?: boolean;
};

export type ChangePlanRequest = {
  priceId: string;
};

export type RefundPaymentRequest = {
  invoiceId?: string;
};

export type ConfirmCheckoutRequest = {
  sessionId: string;
};

export type BillingMessageResponse = {
  message: string;
};

export type BillingPortalResponse = BillingMessageResponse & {
  url: string;
};

export type RefundPaymentResponse = BillingMessageResponse & {
  refundId: string;
  amount: number;
  currency: string;
};

export type PricingPlanCard = {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaLabel: string;
  ctaType: CatalogCtaType;
  highlighted: boolean;
  badge?: string;
  billingCycle?: BillingCycle;
  savingsLabel?: string;
};
