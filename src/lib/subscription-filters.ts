import type { OrganizationPlan } from "../data/admin-organizations";
import type { BillingCycle, SubscriptionRecord } from "../data/admin-subscriptions";
import { parseListParam, setListParam } from "./admin-table-filters";

export const SUBSCRIPTION_FILTER_PARAMS = {
  plan: "subPlan",
  billing: "subBilling",
} as const;

export type SubscriptionFilters = {
  plans: OrganizationPlan[];
  billingCycles: BillingCycle[];
};

export const DEFAULT_SUBSCRIPTION_FILTERS: SubscriptionFilters = {
  plans: [],
  billingCycles: [],
};

const SUBSCRIPTION_PLANS = ["ENTERPRISE", "BUSINESS", "PRO", "FREE"] as const;
const BILLING_CYCLES = ["Annual", "Monthly"] as const;

export function parseSubscriptionFilters(searchParams: URLSearchParams): SubscriptionFilters {
  return {
    plans: parseListParam(searchParams.get(SUBSCRIPTION_FILTER_PARAMS.plan), SUBSCRIPTION_PLANS),
    billingCycles: parseListParam(searchParams.get(SUBSCRIPTION_FILTER_PARAMS.billing), BILLING_CYCLES),
  };
}

export function applySubscriptionFiltersToSearchParams(filters: SubscriptionFilters, current: URLSearchParams) {
  const next = new URLSearchParams(current);

  setListParam(next, SUBSCRIPTION_FILTER_PARAMS.plan, filters.plans);
  setListParam(next, SUBSCRIPTION_FILTER_PARAMS.billing, filters.billingCycles);

  return next;
}

export function countActiveSubscriptionFilters(filters: SubscriptionFilters) {
  return filters.plans.length + filters.billingCycles.length;
}

export function matchesSubscriptionFilters(subscription: SubscriptionRecord, filters: SubscriptionFilters) {
  if (filters.plans.length > 0 && !filters.plans.includes(subscription.plan)) {
    return false;
  }

  if (filters.billingCycles.length > 0 && !filters.billingCycles.includes(subscription.billingCycle)) {
    return false;
  }

  return true;
}

export function getSubscriptionFilterChips(filters: SubscriptionFilters) {
  const chips: { key: string; label: string }[] = [];

  filters.plans.forEach((plan) => {
    chips.push({ key: `plan-${plan}`, label: `Plan: ${plan.charAt(0)}${plan.slice(1).toLowerCase()}` });
  });

  filters.billingCycles.forEach((cycle) => {
    chips.push({ key: `billing-${cycle}`, label: `Billing: ${cycle}` });
  });

  return chips;
}
