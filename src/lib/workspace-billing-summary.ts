import type {
  BillingCatalogProduct,
  BillingCycle,
  CurrentSubscriptionResponse,
  PlanCode,
  SubscriptionStatus,
} from "../types/billing.types";
import { formatCurrency, formatDate } from "./helper";

export type WorkspaceBillingSummary = {
  planName: string;
  priceLabel: string;
  nextPaymentDate: string;
  nextPaymentSubtitle: string;
  paymentMethodTitle: string;
  paymentMethodSubtitle: string;
  statusLabel: string;
};

const PLAN_LABELS: Record<PlanCode, string> = {
  FREE: "Free",
  PRO: "Pro",
  BUSINESS: "Business",
  ENTERPRISE: "Enterprise",
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Active",
  trial: "Trial",
  expired: "Expired",
  cancelled: "Cancelled",
};

function formatBillingCycle(cycle: BillingCycle) {
  return cycle === "Annual" ? "Annual renewal" : "Monthly renewal";
}

function formatPriceLabel(amount: number, currency: string, cycle: BillingCycle) {
  const formatted = formatCurrency(amount, currency, Number.isInteger(amount) ? 0 : 2);
  const suffix = cycle === "Annual" ? "/year" : "/month";
  return `${formatted}${suffix}`;
}

const EMPTY_SUMMARY: WorkspaceBillingSummary = {
  planName: "—",
  priceLabel: "No active subscription",
  nextPaymentDate: "—",
  nextPaymentSubtitle: "Select a plan to get started",
  paymentMethodTitle: "No payment method",
  paymentMethodSubtitle: "Add a card when upgrading your plan",
  statusLabel: "Inactive",
};

export function resolveWorkspaceBillingSummary(
  subscription: CurrentSubscriptionResponse | undefined,
  catalog?: BillingCatalogProduct[],
): WorkspaceBillingSummary {
  if (!subscription) {
    return EMPTY_SUMMARY;
  }

  const catalogPlan = catalog?.find((product) => product.plan === subscription.plan);
  const planName = catalogPlan?.name ?? PLAN_LABELS[subscription.plan];
  const priceLabel =
    subscription.amount > 0
      ? formatPriceLabel(subscription.amount, subscription.currency, subscription.billingCycle)
      : subscription.plan === "FREE"
        ? "Free plan"
        : "Included with your workspace";

  const renewalSource = subscription.renewalDate ?? subscription.expiresAt;
  const nextPaymentDate = renewalSource ? formatDate(renewalSource) : "—";
  const hasStripe = Boolean(subscription.stripeCustomerId);

  return {
    planName,
    priceLabel,
    nextPaymentDate,
    nextPaymentSubtitle: formatBillingCycle(subscription.billingCycle),
    paymentMethodTitle: hasStripe ? "Stripe billing" : "No payment method on file",
    paymentMethodSubtitle: hasStripe
      ? "Managed through secure checkout"
      : "Add a card when upgrading your plan",
    statusLabel: STATUS_LABELS[subscription.status] ?? subscription.status,
  };
}
