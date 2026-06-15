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
  invoices: BillingInvoice[];
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
};
